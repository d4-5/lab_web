'use strict'

const express = require('express')
const router = express.Router()

const shopController = require('./../controllers/shop')

router.get('/', shopController.index)
router.get('/list', shopController.shopList)
router.get('/add', shopController.createShopForm)
router.post('/add', shopController.postCreateShop)
router.get('/edit/:id', shopController.updateShopForm)
router.post('/edit/:id', shopController.putUpdateShop)
router.get('/remove/:id', shopController.deleteShopFrom)
router.post('/remove/:id', shopController.deleteShop)

module.exports = router
