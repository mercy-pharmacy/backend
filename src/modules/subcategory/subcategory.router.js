import { Router } from 'express'
import isAdmin from '../../middlewares/isAdmin.js'
import * as subcategoryController from './subcategory.controller.js'

const router = Router()

router.route('/').post(isAdmin, subcategoryController.createSubcategory)
.get(subcategoryController.getSubcategories)

export default router
