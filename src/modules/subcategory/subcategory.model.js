import mongoose, { Schema, Types, model } from 'mongoose'
import slugify from 'slugify'
import categoryModel from '../category/category.model.js'

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

const subcategoryModel = mongoose.models.Subcategory || model('Subcategory', subcategorySchema)

export default subcategoryModel
