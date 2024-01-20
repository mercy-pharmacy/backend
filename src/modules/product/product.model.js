import mongoose, { Schema, Types, model } from 'mongoose'
import { cloudinaryRemoveImage } from '../../services/cloudinary.js'

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
		sort_order: {
			type: Number,
			default: 0,
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

productSchema.index({
	keywords: 'text',
	name_ar: 'text',
	name_en: 'text',
})

productSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	try {
		console.log("Now I'm in Pre remove product", this._id)
		// Delete product image from Cloudinary
		await cloudinaryRemoveImage(this.image.public_id)
		next() // Proceed with product deletion
	} catch (error) {
		next(error) // Handle errors and prevent product deletion
	}
})
 

const productModel = mongoose.models.Product || model('Product', productSchema)

export default productModel
