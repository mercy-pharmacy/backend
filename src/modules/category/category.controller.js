import { request, response } from 'express'
import slugify from 'slugify'
import { cloudinaryRemoveImage, cloudinaryUploadImage } from '../../services/cloudinary.js'
import categoryModel from './category.model.js'

/** ----------------------------------------------------------------
 * @desc create new category
 * @route /categories
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createCategory = async (req = request, res = response) => {
	const { name_en, name_ar, description_en, description_ar } = req.body
	const category = await categoryModel.findOne({ name_ar, name_en })
	if (category) {
		return res.json(409).json({ message: 'this categroy already exists.' })
	}
	if (!req.file) {
		return res.status(400).json({ message: 'category image is required.' })
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
		slug: slugify(name_en),
		image: { secure_url, public_id },
	})
	return res.status(201).json({ message: 'success', category: newCategory })
}

/** ----------------------------------------------------------------
 * @desc get categories
 * @route /categories
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getCategories = async (req = request, res = response) => {
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
export const getCategory = async (req = request, res = response) => {
	const { categoryId } = req.params
	const category = await categoryModel.findById(categoryId).populate({
		path: 'subcategories',
		populate: {
			path: 'products',
		},
	})
	return res.status(200).json({ message: 'success', category })
}

/** ----------------------------------------------------------------
 * @desc Update category
 * @route /categories/:categoryId
 * @method PUT
 * @access only admin
 -----------------------------------------------------------------
 */
export const updateCategory = async (req = request, res = response) => {
	const categoryId = req.params.categoryId
	const existingCategory = await categoryModel.findById(categoryId)
	if (!existingCategory) {
		return res.status(404).json({ message: 'Category not found' })
	}
	const { name_en, name_ar, description_en, description_ar } = req.body
	existingCategory.name_en = name_en || existingCategory.name_en
	existingCategory.name_ar = name_ar || existingCategory.name_ar
	existingCategory.description_en = description_en || existingCategory.description_en
	existingCategory.description_ar = description_ar || existingCategory.description_ar
	// update slug if the name is changed
	if (name_en) existingCategory.slug = slugify(name_en)

	if (req.file) {
		const { secure_url, public_id } = await cloudinaryUploadImage(
			req.file.path,
			`${process.env.APP_NAME}/categories`,
		)
		await cloudinaryRemoveImage(existingCategory.image.public_id)
		existingCategory.image = { secure_url, public_id }
	}
	await existingCategory.save()
	return res.status(200).json({ message: 'success', category: existingCategory })
}
