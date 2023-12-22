import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
dotenv.config({
	path: process.env.NODE_ENV == 'production' ? '.env.production' : '.env.development',
})

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})
const cloudinaryUploadImage = async (imagePath, folder) => {
	try {
		const { secure_url, public_id } = await cloudinary.uploader.upload(imagePath, { folder })
		return { secure_url, public_id }
	} catch (error) {
		throw new Error(`Cloudinary Error: ${error?.message || error}`)
	}
}
const cloudinaryRemoveImage = async publicId => {
	try {
		await cloudinary.uploader.destroy(publicId)
	} catch (error) {
		throw new Error(`Cloudinary Error: ${error?.message || error}`)
	}
}

export { cloudinaryRemoveImage, cloudinaryUploadImage }

export default cloudinary
