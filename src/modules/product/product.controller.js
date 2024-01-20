import { request, response } from 'express'
import { cloudinaryRemoveImage, cloudinaryUploadImage } from '../../services/cloudinary.js'
import subcategoryModel from '../subcategory/subcategory.model.js'
import productModel from './product.model.js'

/** ----------------------------------------------------------------
 * @desc create new product
 * @route /products
 * @method POST
 * @access only admin
   -----------------------------------------------------------------
 */
export const createProduct = async (req = request, res = response, next) => {
	const { name_en, name_ar, description_en, description_ar, subcategoryId, keywords, sort_order } =
		req.body
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
		sort_order,
	})
	const populated = await productModel.populate(newProduct, {
		path: 'subcategoryId',
		populate: {
			path: 'categoryId',
		},
	})
	return res.status(201).json({ message: 'success', product: populated })
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
	const { name_en, name_ar, description_en, description_ar, subcategoryId, keywords, sort_order } =
		req.body
	if (subcategoryId) {
		const subcategory = await subcategoryModel.findById(subcategoryId)
		if (!subcategory) {
			return next(new Error(`subcategory with id [${subcategoryId}] not found.`, { cause: 404 }))
		}
		product.subcategoryId = subcategoryId
	}
	if (name_ar) product.name_ar = name_ar
	if (name_en) product.name_en = name_en
	if (description_en !== undefined) product.description_en = description_en
	if (description_ar !== undefined) product.description_ar = description_ar
	if (keywords) product.keywords = keywords
	if (sort_order) product.sort_order = sort_order

	if (req.file) {
		const { secure_url, public_id } = await cloudinaryUploadImage(
			req.file.path,
			`${process.env.APP_NAME}/products`,
		)
		await cloudinaryRemoveImage(product.image.public_id)
		product.image = { secure_url, public_id }
	}
	await product.save()
	const populated = await productModel.populate(product, {
		path: 'subcategoryId',
		populate: { path: 'categoryId' },
	})
	return res.status(200).json({ message: 'success', product: populated })
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
	const { search } = req.query
	if (search) {
		let partialSearchFilter = {}
		let textSearchFilter = {}
		textSearchFilter = {
			$text: { $search: search },
		}
		partialSearchFilter = {
			$or: [
				{ name_ar: { $regex: new RegExp(search, 'i') } },
				{ name_en: { $regex: new RegExp(search, 'i') } },
			],
		}
		const partialSearchResults = await productModel.find(partialSearchFilter).populate({
			path: 'subcategoryId',
			populate: {
				path: 'categoryId',
			},
		})
		const textSearchResults = await productModel.find(textSearchFilter).populate({
			path: 'subcategoryId',
			populate: {
				path: 'categoryId',
			},
		})
		const partialSearchProductIds = partialSearchResults.map(product => product._id.toString())
		const uniqueTextSearchResults = textSearchResults.filter(
			product => !partialSearchProductIds.includes(product._id.toString()),
		)

		const __products = [...partialSearchResults, ...uniqueTextSearchResults]
		return res.status(200).json({ message: 'success', products: __products })
	}
	const products = await productModel.find().populate({
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
		return next(new Error(`this product with id [${productId}] not found.`, { cause: 404 }))
	}
	await productToDelete.deleteOne()
	return res.status(200).json({ message: 'success', product: productToDelete })
}
