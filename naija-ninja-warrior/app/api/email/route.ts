import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await resend.emails.send({
      from: 'Naija Ninja Warrior <noreply@naijaninja.com>',
      to,
      subject,
      html,
    })

    if (result.error) {
      return Response.json(
        { error: result.error.message },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      id: result.data?.id,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}