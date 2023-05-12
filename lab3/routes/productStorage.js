'use strict'

const express = require('express')
const router = express.Router()

const productStorageController = require('./../controllers/productStorage')

router.get('/', productStorageController.index)
router.get('/list', productStorageController.productStorageList)
router.get('/add', productStorageController.createProductStorageForm)
router.post('/add', productStorageController.postCreateProductStorage)
router.get('/toStorage/:id', productStorageController.toStorageProductStorageForm)
router.post('/toStorage/:id', productStorageController.putToStorageProductStorage)
router.get('/toShop/:id', productStorageController.toShopProductStorageForm)
router.post('/toShop/:id', productStorageController.putToShopProductStorage)
router.get('/remove/:id', productStorageController.deleteProductStorageFrom)
router.post('/remove/:id', productStorageController.deleteProductStorage)

module.exports = router
