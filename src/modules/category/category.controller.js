import { request, response } from 'express'
import { cloudinaryRemoveImage, cloudinaryUploadImage } from '../../services/cloudinary.js'
import categoryModel from './category.model.js'
import { populate } from 'dotenv'

/** ----------------------------------------------------------------
 * @desc create new category
 * @route /categories
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createCategory = async (req = request, res = response, next) => {
	const { name_en, name_ar, description_en, description_ar } = req.body
	const category = await categoryModel.findOne({ $or: [{ name_ar }, { name_en }] })
	if (category) {
		return next(new Error('this categroy already exists.', { cause: 409 }))
	}
	if (!req.file) {
		return next(new Error('category image is required.', { cause: 400 }))
	}
	const { secure_url, public_id } = await cloudinaryUploadImage(
		req.file.path,
		`${process.env.APP_NAME}/categories`,
	)
	const newCategory = await categoryModel.create({
		name_ar,
		name_en,
		description_ar,
		description_en,
		image: { secure_url, public_id },
	})
	const populatedCategory = await categoryModel.populate(newCategory, {
		path: 'subcategories',
		populate: { path: 'products' },
	})
	return res.status(201).json({ message: 'success', category: populatedCategory })
}

/** ----------------------------------------------------------------
 * @desc get categories
 * @route /categories
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getCategories = async (req = request, res = response, next) => {
	const categories = await categoryModel.find().populate({
		path: 'subcategories',
		populate: {
			path: 'products',
		},
	})
	return res.status(200).json({ message: 'success', categories })
}

/** ----------------------------------------------------------------
 * @desc get category
 * @route /categories/:categoryId
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getCategory = async (req = request, res = response, next) => {
	const { categoryId } = req.params
	const category = await categoryModel.findById(categoryId).populate({
		path: 'subcategories',
		populate: {
			path: 'products',
		},
	})
	if (!category) {
		return next(new Error(`category with id [${categoryId}] not found.`, { cause: 404 }))
	}
	return res.status(200).json({ message: 'success', category })
}

/** ----------------------------------------------------------------
 * @desc Update category
 * @route /categories/:categoryId
 * @method PUT
 * @access only admin
 -----------------------------------------------------------------
 */
export const updateCategory = async (req = request, res = response, next) => {
	const categoryId = req.params.categoryId
	const existingCategory = await categoryModel.findById(categoryId)
	if (!existingCategory) {
		return next(new Error('Category not found.', { cause: 404 }))
	}
	const { name_en, name_ar, description_en, description_ar } = req.body
	existingCategory.name_en = name_en || existingCategory.name_en
	existingCategory.name_ar = name_ar || existingCategory.name_ar
	existingCategory.description_en = description_en || existingCategory.description_en
	existingCategory.description_ar = description_ar || existingCategory.description_ar

	if (req.file) {
		const { secure_url, public_id } = await cloudinaryUploadImage(
			req.file.path,
			`${process.env.APP_NAME}/categories`,
		)
		await cloudinaryRemoveImage(existingCategory.image.public_id)
		existingCategory.image = { secure_url, public_id }
	}
	await existingCategory.save()
	const populatedCategory = await categoryModel.populate(existingCategory, {
		path: 'subcategories',
		populate: {
			path: 'products',
		},
	})
	return res.status(200).json({ message: 'success', category: populatedCategory })
}

/** ----------------------------------------------------------------
 * @desc delete category
 * @route /categories/:categoryId
 * @method DELETE
 * @access only admin
 -----------------------------------------------------------------
 */
export const deleteCategory = async (req = request, res = response, next) => {
	const { categoryId } = req.params
	const categoryToDelete = await categoryModel.findById(categoryId)
	if(!categoryToDelete) {
		return new Error(`this category with id [${categoryId}] not found.`, { cause: 404 })
	}
	await categoryToDelete.deleteOne()
	return res.status(200).json({ message: "success", category: categoryToDelete })
}
