import joi from 'joi'
import { generalFields } from '../../middlewares/validation.js'

export const createProduct = joi.object({
	name_en: joi.string().min(3).max(50).required().label('English name'),
	name_ar: joi.string().min(3).max(50).required().label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	file: generalFields.file.required().label('image'),
	subcategoryId: joi.string().min(24).max(24).required().label('Subcategory Id'),
	keywords: joi.array().items(joi.string()).label('Keywords'),
})

export const updateProduct = joi.object({
	name_en: joi.string().min(3).max(50).label('English name'),
	name_ar: joi.string().min(3).max(50).label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	file: generalFields.file.label('image'),
	subcategoryId: joi.string().min(24).max(24).label('Subcategory Id'),
	keywords: joi.array().items(joi.string()).label('Keywords'),
})

export const searchProduct = joi.object({
	search: joi.string().max(50).label('Search word')
})
