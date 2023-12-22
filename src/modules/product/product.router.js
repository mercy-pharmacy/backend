import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin.js'
import validateObjectId from '../../middlewares/validateObjectId.js'
import { validation } from '../../middlewares/validation.js'
import { asyncHandler } from '../../services/errorHandling.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import * as productController from './product.controller.js'
import * as validator from './product.validation.js'

const router = Router()

router
	.route('/')
	.post(
		isAdmin,
		fileUpload(fileValidation.image).single('image'),
		validation(validator.createProduct),
		asyncHandler(productController.createProduct),
	)
	.get(validation(validator.searchProduct), productController.getProducts)

router
	.route('/:productId')
	.get(validateObjectId('productId'), asyncHandler(productController.getProduct))
	.put(
		validateObjectId('productId'),
		isAdmin,
		fileUpload(fileValidation.image).single('image'),
		validation(validator.updateProduct),
		asyncHandler(productController.updateProduct),
	)
	.delete(validateObjectId('productId'), isAdmin, asyncHandler(productController.deleteProduct))
export default router
