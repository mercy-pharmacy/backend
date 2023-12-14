import { request, response } from 'express'
import productModel from './product.model.js'
import subcategoryModel from '../subcategory/subcategory.model.js'
import { cloudinaryUploadImage } from '../../services/cloudinary.js'

/** ----------------------------------------------------------------
 * @desc create new product
 * @route /products
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createProduct = async (req = request, res = response) => {
	const { name_en, name_ar, description_en, description_ar, subcategoryId, keywords } = req.body
	const subcategory = await subcategoryModel.findById(subcategoryId)
	if (!subcategory) {
		return res.status(404).json({ message: `this subcategory with id [${subcategoryId}] not found.` })
	}
	const product = await productModel.findOne({ name_en, name_ar, subcategoryId })
	if (product) return res.status(409).json({ message: 'this product already exists.' })
	if (!req.file) return res.status(400).json({ message: 'product image is required.' })
	const { secure_url, public_id } = await cloudinaryUploadImage(
		req.file.path,
		`${process.env.APP_NAME}/products`,
	)
	const newProduct = await productModel.create({
		name_ar,
		name_en,
		description_ar,
		description_en,
		slug: subcategory.slug,
		image: { secure_url, public_id },
		subcategoryId,
		keywords,
	})
	return res.status(201).json({ message: 'success', product: newProduct })
}
