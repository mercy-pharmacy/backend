import joi from 'joi'


export const createSubcategory = joi.object({
	name_en: joi.string().min(3).max(50).required().label('English name'),
	name_ar: joi.string().min(3).max(50).required().label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	categoryId: joi.string().min(24).max(24).required().label('Category Id'),
	sort_order: joi.number()
})
export const updateSubcategory = joi.object({
	name_en: joi.string().min(3).max(50).label('English name'),
	name_ar: joi.string().min(3).max(50).label('Arabic name'),
	description_ar: joi.string().max(300).label('Arabic description'),
	description_en: joi.string().max(300).label('English description'),
	categoryId: joi.string().min(24).max(24).label('Category Id'),
	sort_order: joi.number()
})