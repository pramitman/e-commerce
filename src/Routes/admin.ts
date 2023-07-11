"use strict"
import { Router } from 'express'
import { adminController, authController } from '../controllers'

const router = Router()


router.post("/variant/add",  adminController.add_variant)
router.post("/variant/edit", adminController.edit_variant_by_id)
router.delete("/variant/:id",   adminController.delete_variant_by_id)
router.post("/variant/get/all", adminController.get_all_variant)
router.get("/variant/:id",  adminController.get_by_id_variant)

router.post("/fabric/master/add",  adminController.add_fabric_master)
router.post("/fabric/master/edit", adminController.edit_fabric_master_by_id)
router.delete("/fabric/master/:id",   adminController.delete_fabric_master_by_id)
router.post("/fabric/master/get/all", adminController.get_all_fabric_master)
router.get("/fabric/master/:id",  adminController.get_by_id_fabric_master)

router.post("/collar/master/add",  adminController.add_collar_master)
router.post("/collar/master/edit", adminController.edit_collar_master_by_id)
router.delete("/collar/master/:id",   adminController.delete_collar_master_by_id)
router.post("/collar/master/get/all", adminController.get_all_collar_master)
router.get("/collar/master/:id",  adminController.get_by_id_collar_master)

router.post("/button/master/add",  adminController.add_button_master)
router.post("/button/master/edit", adminController.edit_button_master_by_id)
router.delete("/button/master/:id",   adminController.delete_button_master_by_id)
router.post("/button/master/get/all", adminController.get_all_button_master)
router.get("/button/master/:id",  adminController.get_by_id_button_master)

export const adminRouter = router