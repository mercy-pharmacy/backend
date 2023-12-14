import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin.js'
import * as productController from './product.controller.js'
import fileUpload, { fileValidation } from '../../services/multer.js'

const router = Router()

router
	.route('/')
	.post(isAdmin, fileUpload(fileValidation.image).single('image'), productController.createProduct)

export default router
