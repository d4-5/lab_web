'use strict'

const express = require('express')
const router = express.Router()

const productShopController = require('../controllers/productShop')

router.get('/', productShopController.index)
router.get('/list', productShopController.productShopList)
router.get('/toStorage/:id', productShopController.toStorageProductShopForm)
router.post('/toStorage/:id', productShopController.putToStorageProductShop)

module.exports = router
