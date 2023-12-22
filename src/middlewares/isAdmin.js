import { request, response } from 'express'
import jwt from 'jsonwebtoken'
import adminModel from '../modules/admin/admin.model.js'
// const isAdmin = (req = request, res = response, next) => {
// 	const token = req.headers['admin-token']
// 	if (token == process.env.ADMIN_SECRET_KEY) {
// 		next()
// 	} else {
// 		return res.status(401).json({ message: 'Unauthorized.' })
// 	}
// }

const isAdmin = async (req = request, res = response, next) => {
	const token = req.headers['admin-token']
	try {
		if (!token) {
			return next(new Error('No token provided!', { cause: 401 }))
		}
		const decode = jwt.verify(token, process.env.JWT_SECRET)
		const existAdmin = await adminModel.findById(decode.id)
		if (!existAdmin) {
			return next(new Error('Unauthorized access - Admin not found', { cause: 401 }))
		}
		req.user = decode
		next()
	} catch (error) {
		return next(new Error('Invalid token', { cause: 401 }))
	}
}

export default isAdmin
