import nodemailer from 'nodemailer'

export const sendMail = async (email, subject, html) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.APP_EMAIL_ADDRESS,
				pass: process.env.APP_EMAIL_PASSWORD,
			},
		})
		const info = await transporter.sendMail({
			from: email,
			to: process.env.APP_EMAIL_ADDRESS,
			subject,
			html,
		})
		console.log('Email sent successfully', info.response)
	} catch (error) {
		throw new Error('Internal server error(nodemailer)')
	}
}
