import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin.js'
import validateObjectId from '../../middlewares/validateObjectId.js'
import { asyncHandler } from '../../services/errorHandling.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import * as categoryController from './category.controller.js'
import { validation } from '../../middlewares/validation.js'
import * as validator from './category.validation.js'
const router = Router()

router
	.route('/')
	.post(
		isAdmin,
		fileUpload(fileValidation.image).single('image'),
		validation(validator.createCategory),
		asyncHandler(categoryController.createCategory),
	)
	.get(asyncHandler(categoryController.getCategories))

router
	.route('/:categoryId')
	.put(
		validateObjectId('categoryId'),
		isAdmin,
		fileUpload(fileValidation.image).single('image'),
        validation(validator.updateCategory),
		asyncHandler(categoryController.updateCategory),
	)
	.get(validateObjectId('categoryId'), asyncHandler(categoryController.getCategory))

export default router
