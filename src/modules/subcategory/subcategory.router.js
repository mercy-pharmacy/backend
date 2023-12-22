import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin.js'
import validateObjectId from '../../middlewares/validateObjectId.js'
import * as subcategoryController from './subcategory.controller.js'
import { asyncHandler } from '../../services/errorHandling.js'
import * as validator from './subcategory.validation.js'
import { validation } from '../../middlewares/validation.js'

const router = Router()

router
	.route('/')
	.post(
		isAdmin,
		validation(validator.createSubcategory),
		asyncHandler(subcategoryController.createSubcategory),
	)
	.get(asyncHandler(subcategoryController.getSubcategories))

router
	.route('/:subcategoryId')
	.put(
		validateObjectId('subcategoryId'),
		isAdmin,
		validation(validator.updateSubcategory),
		asyncHandler(subcategoryController.updateSubcategory),
	)
	.get(validateObjectId('subcategoryId'), asyncHandler(subcategoryController.getSubcategory))
	.delete(
		validateObjectId('subcategoryId'),
		isAdmin,
		asyncHandler(subcategoryController.deleteSubcategory),
	)

export default router
