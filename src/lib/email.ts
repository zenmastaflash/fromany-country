import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendExpirationNotification(
  email: string,
  documentName: string,
  daysUntilExpiry: number,
  documentType: string
) {
  try {
    await resend.emails.send({
      from: 'notifications@fromany.country',
      to: email,
      subject: `Document Expiration Notice - ${documentName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Document Expiration Notice</h2>
          <p>Your ${documentType} - ${documentName} will expire in ${daysUntilExpiry} days.</p>
          <p style="margin-top: 20px;">
            Please take action to renew this document to maintain compliance with your travel and residency requirements.
          </p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p style="margin: 0;"><strong>Document Details:</strong></p>
            <ul style="margin-top: 10px;">
              <li>Type: ${documentType}</li>
              <li>Name: ${documentName}</li>
              <li>Days until expiry: ${daysUntilExpiry}</li>
            </ul>
          </div>
          <p style="margin-top: 30px;">
            <a href="https://fromany.country/documents" 
               style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Document
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
}