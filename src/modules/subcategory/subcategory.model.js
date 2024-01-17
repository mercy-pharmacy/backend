import mongoose, { Schema, Types, model } from 'mongoose'
import productModel from '../product/product.model.js'

const subcategorySchema = new Schema(
	{
		name_en: {
			type: String,
			required: true,
			unique: true,
		},
		name_ar: {
			type: String,
			required: true,
			unique: true,
		},
		description_ar: {
			type: String,
		},
		description_en: {
			type: String,
		},
		categoryId: {
			type: Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		sort_order: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
	},
)

subcategorySchema.virtual('products', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'subcategoryId',
})

subcategorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		console.log("Now I'm in Pre remove subcategory", this._id)
		// Delete associated products
		// Manually trigger the deleteOne middleware for each related product
		const products = await productModel.find({ subcategoryId: this._id })
		for (const product of products) {
			await product.deleteOne()
		}
		next() // Proceed with subcategory deletion
	} catch (error) {
		next(error) // Prevent subcategory deletion if product removal fails
	}
})

const subcategoryModel = mongoose.models.Subcategory || model('Subcategory', subcategorySchema)

export default subcategoryModel
