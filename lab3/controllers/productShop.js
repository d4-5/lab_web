'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const productShopListService = require('./../services/productShop.all')
const productStorageCreateService = require('./../services/productStorage.create')
const productShopDeleteService = require('./../services/productShop.delete')
const productShopByIdService = require('./../services/productShop.byId')
const storageListService = require('./../services/storage.all')
const productStorageListService = require('./../services/productStorage.all')

module.exports = {
  index (req, res) {
    res.render('pages/productShop/index')
  },
  async productShopList (req, res) {
    try {
      const productShopList = await productShopListService()
      res.render('pages/productShop/list', {
        productShops: productShopList
      })
    } catch (error) {
      res.render('pages/productShop/list', {
        productShops: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  async toStorageProductShopForm (req, res, next) {
    try {
      const productShop = await productShopByIdService(req.params.id)
      let storageList = await storageListService()
      if (!productShop) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/productShop/toStorage', { 
        productShop: productShop,
        storages: storageList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putToStorageProductShop: [
    body('storage')
    .isLength({ min: 1 }).trim().withMessage('Storage field must be specified.'),
    sanitizeBody('storage').escape(),
    async (req, res, next) => {
      let productStorageData = req.body
      const productShop = await productShopByIdService(req.body.id)
      const storageList = await storageListService()
      productStorageData["product"] = productShop.product
      const storageData = await storageList.find(s => s.number == req.body.storage)
      const productStorageList = await productStorageListService()
      const totalUsed = productStorageList.filter(ps => ps.storage == req.body.storage)
      if(totalUsed.length === storageData.capacity){
        req.flash('info', `Can't move product "${productShop.product}" to storage "${req.body.storage}"`)
        res.redirect('/productStorage/list')
      } else {
        const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          await productShopDeleteService(req.body)
          await productStorageCreateService(productStorageData)
          req.flash('info', `Product "${productShop.product}" moved to storage "${productStorageData.storage}"`)
          res.redirect('/productShop/list')
        } catch (error) {
          res.render('pages/productShop/toStorage', {
            productShop: productShop,
            storages: storageList,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/productShop/delete', {
          productShop: {},
          productStorageData: productStorageData,
          errors: errors.array()
        })
      }
    }
    }
  ]
}
