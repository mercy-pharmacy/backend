import mongoose, { Schema, Types, model } from 'mongoose'
import subcategoryModel from '../subcategory/subcategory.model.js'

const productSchema = new Schema(
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
		image: {
			type: Object,
			required: true,
		},
		subcategoryId: {
			type: Types.ObjectId,
			ref: 'Subcategory',
			required: true,
		},
		keywords: {
			type: [String],
		},
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

const productModel = mongoose.models.Product || model('Product', productSchema)

export default productModel
