import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin.js'
import validateObjectId from '../../middlewares/validateObjectId.js'
import fileUpload, { fileValidation } from '../../services/multer.js'
import * as categoryController from './category.controller.js'
const router = Router()

router
	.route('/')
	.post(isAdmin, fileUpload(fileValidation.image).single('image'), categoryController.createCategory)
	.get(categoryController.getCategories)

router
	.route('/:categoryId')
	.put(
		validateObjectId('categoryId'),
		isAdmin,
		fileUpload(fileValidation.image).single('image'),
		categoryController.updateCategory,
	)
	.get(validateObjectId('categoryId'), categoryController.getCategory)

export default router
