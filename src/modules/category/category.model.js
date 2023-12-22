import mongoose, { Schema, model } from 'mongoose'
import slugify from 'slugify'
import { cloudinaryRemoveImage } from '../../services/cloudinary.js'
import subcategoryModel from '../subcategory/subcategory.model.js'

const categorySchema = new Schema(
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

categorySchema.virtual('subcategories', {
	ref: 'Subcategory',
	localField: '_id',
	foreignField: 'categoryId',
})

categorySchema.virtual('slug').get(function () {
	return slugify(this.name_en, { lower: true })
})

categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		console.log("Now I'm in Pre remove category", this._id)
		await cloudinaryRemoveImage(this.image.public_id)
		// delete all related subcategories and products
		// Manually trigger the deleteOne middleware for each related subcategory
		const subcategories = await subcategoryModel.find({ categoryId: this._id })
		for (const subcategory of subcategories) {
			await subcategory.deleteOne()
		}
		next()
	} catch (error) {
		next(error)
	}
})

const categoryModel = mongoose.models.Category || model('Category', categorySchema)

export default categoryModel
