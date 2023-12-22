import {Router} from 'express'
import * as adminController from './admin.controllers.js'
import * as validator from './admin.validation.js'
import { validation } from "../../middlewares/validation.js"
import isAdmin from "../../middlewares/isAdmin.js"

const router = Router()

// /create
router.post('/create', validation(validator.admin), adminController.createAdmin)

// /login
router.post("/login", validation(validator.admin), adminController.adminLogin)

// /update
router.put('/update', isAdmin, validation(validator.updateAdmin), adminController.updateAdminInfo)

// /info
router.get('/info', isAdmin, adminController.getAdminUsername)

export default router