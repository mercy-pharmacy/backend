import { request, response } from 'express'
import { Types } from 'mongoose'

const validateObjectId = paramsName => {
	return (req = request, res = response, next) => {
		if (!Types.ObjectId.isValid(req.params[paramsName]))
			return res.status(400).json({ message: 'invalid id.' })
		else next()
	}
}

export default validateObjectId
