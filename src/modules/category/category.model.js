import mongoose, { Schema, model, Types } from 'mongoose'

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
		slug: {
			type: String,
			required: true,
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
            virtuals: true
        }
	},
)

categorySchema.virtual('subcategories', {
	ref: 'Subcategory',
	localField: '_id',
	foreignField: 'categoryId',
})

const categoryModel = mongoose.models.Category || model('Category', categorySchema)

export default categoryModel
