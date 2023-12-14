import mongoose, { Schema, model, Types } from 'mongoose'
import slugify from 'slugify'

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

const categoryModel = mongoose.models.Category || model('Category', categorySchema)

export default categoryModel
