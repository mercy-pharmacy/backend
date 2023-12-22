import joi from 'joi'

export const admin = joi.object({
	username: joi.string().min(3).max(20).required(),
	password: joi.string().min(3).max(20).required(),
})

export const updateAdmin = joi.object({
	username: joi.string().min(3).max(20).required(),
	oldPassword: joi.string().min(3).max(20),
	newPassword: joi.string().min(3).max(20),
})
