import { request, response } from 'express'

const isAdmin = (req = request, res = response, next) => {
	const token = req.headers['admin-token']
	if (token == process.env.ADMIN_SECRET_KEY) {
		next()
	} else {
		return res.status(401).json({ message: 'Unauthorized.' })
	}
}

export default isAdmin
