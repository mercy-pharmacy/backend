import { request, response } from 'express'
import subcategoryModel from '../subcategory/subcategory.model.js'
import { cloudinaryRemoveImage, cloudinaryUploadImage } from '../../services/cloudinary.js'
import productModel from './product.model.js'

/** ----------------------------------------------------------------
 * @desc create new product
 * @route /products
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createProduct = async (req = request, res = response, next) => {
	const { name_en, name_ar, description_en, description_ar, subcategoryId, keywords } = req.body
	const subcategory = await subcategoryModel.findById(subcategoryId)
	if (!subcategory) {
		return next(new Error(`this subcategory with id [${subcategoryId}] not found.`, { cause: 404 }))
	}
	const product = await productModel.findOne({
		$or: [
			{ name_ar, subcategoryId },
			{ name_en, subcategoryId },
		],
	})
	if (product) return next(new Error('this product already exists.', { cause: 409 }))
	if (!req.file) return next(new Error('product image is required.', { cause: 400 }))
	const { secure_url, public_id } = await cloudinaryUploadImage(
		req.file.path,
		`${process.env.APP_NAME}/products`,
	)
	const newProduct = await productModel.create({
		name_ar,
		name_en,
		description_ar,
		description_en,
		image: { secure_url, public_id },
		subcategoryId,
		keywords,
	})
	return res.status(201).json({ message: 'success', product: newProduct })
}

/** ----------------------------------------------------------------
 * @desc update product
 * @route /products/:productId
 * @method PUT
 * @access inly admin
   -----------------------------------------------------------------
 */
export const updateProduct = async (req = request, res = response, next) => {
	const { productId } = req.params
	const product = await productModel.findById(productId)
	if (!product) {
		return next(new Error(`product with id [${productId}] not found.`, { cause: 404 }))
	}
	const { name_en, name_ar, description_en, description_ar, subcategoryId, keywords } = req.body
	if (subcategoryId) {
		const subcategory = await subcategoryModel.findById(subcategoryId)
		if (!subcategory) {
			return next(new Error(`subcategory with id [${subcategoryId}] not found.`, { cause: 404 }))
		}
		product.subcategoryId = subcategoryId
	}
	product.name_ar = name_ar || product.name_ar
	product.name_en = name_en || product.name_en
	product.description_en = description_en || product.description_en
	product.description_ar = description_ar || product.description_ar
	product.keywords = keywords || product.keywords
	if (req.file) {
		const { secure_url, public_id } = await cloudinaryUploadImage(
			req.file.path,
			`${process.env.APP_NAME}/products`,
		)
		await cloudinaryRemoveImage(product.image.public_id)
		product.image = { secure_url, public_id }
	}
	await product.save()
	return res.status(200).json({ message: 'success update', product })
}

/** ----------------------------------------------------------------
 * @desc get product
 * @route /products/:productId
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getProduct = async (req = request, res = response, next) => {
	const { productId } = req.params
	const product = await productModel.findById(productId).populate({
		path: 'subcategoryId',
		populate: {
			path: 'categoryId',
		},
	})
	if (!product) {
		return next(new Error(`product with id [${productId}] not found.`, { cuase: 404 }))
	}
	return res.status(200).json({ message: 'success', product })
}

/** ----------------------------------------------------------------
 * @desc get products
 * @route /products
 * @method GET
 * @access ALL
   -----------------------------------------------------------------
 */
export const getProducts = async (req = request, res = response, next) => {
	let filter = {}
	const { search } = req.query
	if (search) {
		filter = {
			$text: { $search: search },
		}
	}
	const products = await productModel.find(filter).populate({
		path: 'subcategoryId',
		populate: {
			path: 'categoryId',
		},
	})
	return res.status(200).json({ message: 'success', products })
}

/** ----------------------------------------------------------------
 * @desc delete product
 * @route /products/:productId
 * @method DELETE
 * @access only admin
 -----------------------------------------------------------------
 */
export const deleteProduct = async (req = request, res = response, next) => {
	const { productId } = req.params
	const productToDelete = await productModel.findById(productId)
	if (!productToDelete) {
		return new Error(`this product with id [${productId}] not found.`, { cause: 404 })
	}
	await productToDelete.deleteOne()
	return res.status(200).json({ message: 'success', product: productToDelete })
}
