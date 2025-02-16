import nodemailer from 'nodemailer'
import { EMAIL_CONFIG } from '../config/config'

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: EMAIL_CONFIG.EMAIL_SERVICE,
      auth: {
        user: EMAIL_CONFIG.EMAIL_USER,
        pass: EMAIL_CONFIG.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: EMAIL_CONFIG.EMAIL_FROM,
      to,
      subject,
      text,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error(`Error al enviar el correo electrónico: ${error}`)
  }
}
