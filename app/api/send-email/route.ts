// File: app/api/send-email/route.ts

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Now using your verified domain!
    const result = await resend.emails.send({
      from: 'Naija Ninja Warrior <noreply@naijaninja.net>',
      to: to, // Can now send to any email address
      subject: subject,
      html: html,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return Response.json({ error: result.error.message }, { status: 400 })
    }

    return Response.json({
      success: true,
      id: result.data?.id,
      message: `Email sent successfully to ${to}`
    })
  } catch (error) {
    console.error('Email send error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}