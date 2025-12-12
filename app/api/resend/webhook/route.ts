// File: app/api/resend/webhook/route.ts
// This receives emails sent to support@naijaninja.net

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
)

const resend = new Resend(process.env.RESEND_API_KEY!)

// Verify webhook signature from Resend
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const digest = hmac.digest('hex')
  return digest === signature
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)

    // Verify webhook signature (security best practice)
    const signature = request.headers.get('svix-signature') || request.headers.get('x-resend-signature')
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET

    if (webhookSecret && signature) {
      // Extract the actual signature from the header
      // Resend uses format like: v1,signature_value
      const signatureValue = signature.split(',')[1] || signature
      
      const isValid = verifySignature(rawBody, signatureValue, webhookSecret)
      
      if (!isValid) {
        console.error('Invalid webhook signature')
        return Response.json({ error: 'Invalid signature' }, { status: 401 })
      }
      
      console.log('Webhook signature verified ✓')
    } else {
      console.warn('⚠️ Webhook signature verification skipped (no secret configured)')
    }
    
    console.log('Received webhook from Resend:', payload.type)

    // Resend sends 'email.received' event when someone emails support@naijaninja.net
    if (payload.type === 'email.received') {
      const email = payload.data
      
      const {
        from,
        to,
        subject,
        text,
        html,
        message_id
      } = email

      console.log('Incoming support email:', {
        from,
        to,
        subject
      })

      // Extract sender name from email (if format is "Name <email@example.com>")
      let senderName = from
      let senderEmail = from
      
      const emailMatch = from.match(/(.*?)\s*<(.+?)>/)
      if (emailMatch) {
        senderName = emailMatch[1].trim()
        senderEmail = emailMatch[2].trim()
      }

      // Store in Supabase inquiries table
      const { data: inquiry, error: insertError } = await supabase
        .from('inquiries')
        .insert([
          {
            name: senderName,
            email: senderEmail,
            subject: subject || 'No Subject',
            message: text || html || 'No message content',
            status: 'new',
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Error saving inquiry to database:', insertError)
        throw insertError
      }

      console.log('Inquiry saved to database:', inquiry.id)

      // Send auto-reply email
      const autoReply = await resend.emails.send({
        from: 'Naija Ninja Support <support@naijaninja.net>',
        to: senderEmail,
        subject: `Re: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a7346 0%, #0d5a33 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">Naija Ninja Warrior</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Support Team</p>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Thank you for contacting us!</h2>
              <p style="color: #666; line-height: 1.6;">
                We've received your support request and our team will review it shortly. 
                You can expect a response within 24 hours.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #1a7346;">
                <p style="margin: 0; color: #888; font-size: 14px; margin-bottom: 10px;"><strong>Your message:</strong></p>
                <p style="margin: 0; color: #333; white-space: pre-wrap;">${text?.substring(0, 300) || 'No message content'}${text && text.length > 300 ? '...' : ''}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                In the meantime, you might find helpful resources in our 
                <a href="https://naijaninja.net/faq" style="color: #1a7346; text-decoration: none; font-weight: bold;">FAQ section</a>.
              </p>
              
              <p style="color: #666; margin-top: 30px;">
                Best regards,<br/>
                <strong>The Naija Ninja Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">Support Ticket ID: ${inquiry.id}</p>
              <p style="margin: 5px 0;">© 2024 Naija Ninja Warrior. All rights reserved.</p>
            </div>
          </div>
        `
      })

      if (autoReply.error) {
        console.error('Failed to send auto-reply:', autoReply.error)
      } else {
        console.log('Auto-reply sent successfully')
      }

      return Response.json({ 
        success: true,
        inquiryId: inquiry.id,
        autoReplySent: !!autoReply.data
      })
    }

    // Handle other webhook events if needed
    return Response.json({ success: true, type: payload.type })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return Response.json({ 
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}