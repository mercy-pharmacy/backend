import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

export const createCategory = joi.object({
	name_en: joi.string().min(3).max(25).label('English name'),
	name_ar: joi.string().min(3).max(25).required().label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	file: generalFields.file.required().label('image'),
})
export const updateCategory = joi.object({
	name_en: joi.string().min(3).max(25).label('English name'),
	name_ar: joi.string().min(3).max(25).label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	file: generalFields.file.label('image'),
})
