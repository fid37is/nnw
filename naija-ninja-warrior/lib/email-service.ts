export const emailTemplates = {
    applicationApproved: (name: string) => ({
      subject: 'Your Naija Ninja Warrior Application is Approved! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #007a5e 0%, #10c084 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0;">Congratulations!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">Your application has been approved</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hi ${name},
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Great news! Your application for <strong>Naija Ninja Warrior</strong> has been <strong style="color: #007a5e;">APPROVED</strong>! 
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              You are now eligible to compete in the challenge. Get ready to test your strength, agility, and determination against other competitors from across Nigeria.
            </p>
          </div>
  
          <div style="background: #007a5e; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px;">
              <a href="https://naijaninja.com/user/dashboard" style="color: white; text-decoration: none; font-weight: bold;">
                View Your Dashboard →
              </a>
            </p>
          </div>
  
          <div style="border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Questions? Contact us at support@naijaninja.com</p>
            <p style="margin: 5px 0;">© 2025 Naija Ninja Warrior. All rights reserved.</p>
          </div>
        </div>
      `,
    }),
  
    applicationRejected: (name: string, feedback: string = '') => ({
      subject: 'Naija Ninja Warrior Application Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; color: #333;">Application Update</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">Thank you for applying</p>
          </div>
          
          <div style="background: #fef5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #E74C3C;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
              Hi ${name},
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for submitting your application to Naija Ninja Warrior. After careful review, we regret to inform you that your application was not selected for this season.
            </p>
            ${feedback ? `
              <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
                <p style="color: #666; font-size: 13px; margin: 0 0 8px 0;"><strong>Feedback:</strong></p>
                <p style="color: #666; font-size: 13px; margin: 0;">${feedback}</p>
              </div>
            ` : ''}
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 15px;">
              We encourage you to apply again in future seasons. Keep training and improving!
            </p>
          </div>
  
          <div style="border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">Questions? Contact us at support@naijaninja.com</p>
            <p style="margin: 5px 0;">© 2025 Naija Ninja Warrior. All rights reserved.</p>
          </div>
        </div>
      `,
    }),
  }