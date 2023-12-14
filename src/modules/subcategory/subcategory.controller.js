import { request, response } from 'express'
import slugify from 'slugify'
import subcategoryModel from './subcategory.model.js'
import categoryModel from '../category/category.model.js'

/** ----------------------------------------------------------------
 * @desc create new subcategory
 * @route /subcategory
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createSubcategory = async (req = request, res = response) => {
	const { name_en, name_ar, description_en, description_ar, categoryId } = req.body
	const category = await categoryModel.findById(categoryId)
	if (!category) {
		return res.status(404).json({ message: `category with id [${categoryId}] not found.` })
	}
	const subcategory = await subcategoryModel.findOne({ name_ar, name_en, categoryId })
	if (subcategory) {
		return res.json(409).json({ message: 'this subcategroy already exists.' })
	}
	const newSubcategory = await subcategoryModel.create({
		name_en,
		name_ar,
		description_ar,
		description_en,
		slug: slugify(category.name_en),
		categoryId,
	})
	return res.status(201).json({ message: 'success', subcategory: newSubcategory })
}

/** ----------------------------------------------------------------
 * @desc get all subcategories
 * @route /subcategory
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getSubcategories = async (req = request, res = response) => {
	const subcategories = await subcategoryModel.find().populate('products')
	return res.status(200).json({ message: 'success', subcategories })
}
