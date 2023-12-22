import jwt from 'jsonwebtoken'
import { asyncHandler } from '../../services/errorHandling.js'
import adminModel from './admin.model.js'

export const adminLogin = asyncHandler(async (req, res, next) => {
	const { username, password } = req.body
	const admin = await adminModel.findOne({ username, password })
	if (!admin) return next(new Error('Invalid credentials', { cause: 401 }))
	const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15d' })
	return res.status(200).json({ message: 'success', token })
})
export const getAdminUsername = asyncHandler(async (req, res, next) => {
    const admin = await adminModel.findById(req.user.id)
    return res.status(200).json({message:"success", username: admin.username})
})
export const updateAdminInfo = asyncHandler(async (req, res, next) => {
	const { username, oldPassword, newPassword } = req.body
	if ((!oldPassword && newPassword) || (oldPassword && !newPassword)) {
		return next(new Error('Both oldPassword and newPassword are required', { cause: 400 }))
	}
	let admin = await adminModel.findById(req.user.id)
	admin.username = username || admin.username
	if (oldPassword && newPassword) {
		if (admin.password !== oldPassword) return next(new Error('password incorrect!', { cause: 400 }))
		admin.password = newPassword
	}
	await admin.save()
	return res.status(200).json({ message: 'success' })
})

export const createAdmin = asyncHandler(async (req, res, next) => {
	const { username, password } = req.body
	const existingAdmin = await adminModel.findOne({})
	if (existingAdmin) {
		return next(new Error('Admin is already created.', { cause: 400 }))
	} else {
		const admin = await adminModel.create({ username, password })
		return res.status(201).json({ message: 'Admin created successfully', admin })
	}
})
