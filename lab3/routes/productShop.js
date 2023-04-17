'use strict'

const express = require('express')
const router = express.Router()

const productShopController = require('../controllers/productShop')

router.get('/', productShopController.index)
router.get('/list', productShopController.productShopList)
router.get('/add', productShopController.createProductShopForm)
router.post('/add', productShopController.postCreateProductShop)
router.get('/edit/:id', productShopController.updateProductShopForm)
router.post('/edit/:id', productShopController.putUpdateProductShop)
router.get('/remove/:id', productShopController.deleteProductShopFrom)
router.post('/remove/:id', productShopController.deleteProductShop)

module.exports = router
