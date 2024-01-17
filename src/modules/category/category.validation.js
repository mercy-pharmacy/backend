import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

export const createCategory = joi.object({
	name_en: joi.string().min(3).max(50).label('English name'),
	name_ar: joi.string().min(3).max(50).required().label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	file: generalFields.file.required().label('image'),
	sort_order: joi.number()
})
export const updateCategory = joi.object({
	name_en: joi.string().min(3).max(50).label('English name'),
	name_ar: joi.string().min(3).max(50).label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	file: generalFields.file.label('image'),
	sort_order: joi.number()
})
