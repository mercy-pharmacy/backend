import { request, response } from 'express'
import categoryModel from '../category/category.model.js'
import subcategoryModel from './subcategory.model.js'

/** ----------------------------------------------------------------
 * @desc create new subcategory
 * @route /subcategory
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createSubcategory = async (req = request, res = response, next) => {
	const { name_en, name_ar, description_en, description_ar, categoryId } = req.body
	const category = await categoryModel.findById(categoryId)
	if (!category) {
		return next(new Error(`category with id [${categoryId}] not found.`, { cuase: 404 }))
	}
	const subcategory = await subcategoryModel.findOne({ name_ar, name_en, categoryId })
	if (subcategory) {
		return next(new Error(`this subcategroy already exists.`, { cause: 409 }))
	}
	const newSubcategory = await subcategoryModel.create({
		name_en,
		name_ar,
		description_ar,
		description_en,
		categoryId,
	})
	const populated = await subcategoryModel.populate(newSubcategory, [
		{ path: 'categoryId' },
		{ path: 'products' },
	])
	return res.status(201).json({ message: 'success', subcategory: populated })
}

/** ----------------------------------------------------------------
 * @desc get all subcategories
 * @route /subcategory
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getSubcategories = async (req = request, res = response, next) => {
	const subcategories = await subcategoryModel.find().populate('categoryId').populate('products')
	return res.status(200).json({ message: 'success', subcategories })
}

/** ----------------------------------------------------------------
 * @desc update subcategory
 * @route /subcategory/:subcategoryId
 * @method PUT
 * @access only admin
   -----------------------------------------------------------------
 */
export const updateSubcategory = async (req = request, res = response, next) => {
	const { subcategoryId } = req.params
	const subcategory = await subcategoryModel.findById(subcategoryId)
	if (!subcategory) {
		return next(new Error(`subcategory with id [${subcategoryId}] not found.`, { cause: 404 }))
	}
	const { name_en, name_ar, description_en, description_ar, categoryId } = req.body
	if (categoryId) {
		const category = await categoryModel.findById(categoryId)
		if (!category) {
			return next(new Error(`category with id [${categoryId}] not found.`, { cause: 404 }))
		}
		subcategory.categoryId = categoryId
	}
	subcategory.name_ar = name_ar || subcategory.name_ar
	subcategory.name_en = name_en || subcategory.name_en
	subcategory.description_en = description_en || subcategory.description_en
	subcategory.description_ar = description_ar || subcategory.description_ar
	await subcategory.save()
	const populated = await subcategoryModel.populate(subcategory, [
		{ path: 'categoryId' },
		{ path: 'products' },
	])
	return res.status(200).json({ message: 'success', subcategory: populated })
}

/** ----------------------------------------------------------------
 * @desc get subcategory
 * @route /subcategory/:subcategoryId
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getSubcategory = async (req = request, res = response) => {
	const { subcategoryId } = req.params
	const subcategory = await subcategoryModel
		.findById(subcategoryId)
		.populate('categoryId')
		.populate('products')
	if (!subcategory) {
		return next(new Error(`subcategory with id [${subcategoryId}] not found.`, { cause: 404 }))
	}
	return res.status(200).json({ message: 'success', subcategory })
}

/** ----------------------------------------------------------------
 * @desc delete subcategory
 * @route /subcategory/:subcategoryId
 * @method DELETE
 * @access only admin
 -----------------------------------------------------------------
 */
export const deleteSubcategory = async (req = request, res = response, next) => {
	const { subcategoryId } = req.params
	const subcategoryToDelete = await subcategoryModel.findById(subcategoryId)
	if (!subcategoryToDelete) {
		return next(new Error(`this product with id [${subcategoryId}] not found.`, { cause: 404 }))
	}
	await subcategoryToDelete.deleteOne()
	return res.status(200).json({ message: 'success', subcategory: subcategoryToDelete })
}
