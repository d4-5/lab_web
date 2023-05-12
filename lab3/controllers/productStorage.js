'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const productStorageListService = require('./../services/productStorage.all')
const productStorageCreateService = require('./../services/productStorage.create')
const productStorageUpdateService = require('./../services/productStorage.update')
const productStorageDeleteService = require('./../services/productStorage.delete')
const productStorageByIdService = require('./../services/productStorage.byId')
const productListService = require('./../services/product.all')
const shopListService = require('./../services/shop.all')
const storageListService = require('./../services/storage.all')
const storageByIdService = require('./../services/storage.byId')
const productShopCreateService = require('./../services/productShop.create')
const productShopListService = require('./../services/productShop.all')

module.exports = {
  index (req, res) {
    res.render('pages/productStorage/index')
  },
  async productStorageList (req, res) {
    try {
      const productStorageList = await productStorageListService()
      res.render('pages/productStorage/list', {
        productStorages: productStorageList
      })
    } catch (error) {
      res.render('pages/productStorage/list', {
        productStorages: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  async createProductStorageForm (req, res) {
    try {
      const productList = await productListService()
      const storageList = await storageListService()
      res.render('pages/productStorage/add', { 
        products: productList,
        storages: storageList
       })
    } catch (error) {
      res.render('pages/productStorage/list', {
        products: productList,
        storages: storageList,
        errors: [{ msg: error.message }]
      })
    }
  },
  postCreateProductStorage: [
    body('storage')
    .isLength({ min: 1 }).trim().withMessage('Storage field must be specified.'),
    body('product')
      .isLength({ min: 1 }).trim().withMessage('Product field must be specified.'),
    sanitizeBody('storage').escape(),
    sanitizeBody('product').escape(),
    async (req, res) => {
      const productStorageData = req.body
      const errors = validationResult(req)
      const productList = await productListService()
      const storageList = await storageListService()
      const storageData = await storageList.find(s => s.number == req.body.storage)
      const productStorageList = await productStorageListService()
      const totalUsed = productStorageList.filter(ps => ps.storage == req.body.storage)
      if(totalUsed.length === storageData.capacity){
        req.flash('info', `Can't add product "${req.body.product}" to storage "${req.body.storage}"`)
        res.redirect('/productStorage/list')
      } else { 
        if (errors.isEmpty()) {
          try {
            const productStorage = await productStorageCreateService(productStorageData)
            req.flash('info', `Product "${productStorage.product}" is added to storage "${productStorage.storage}"`)
            res.redirect('/productStorage/list')
          } catch (error) {
            res.render('pages/productStorage/add', {
              products: productList,
              storages: storageList,
              errors: [{ msg: error.message }]
            })
          }
        } else {
          res.render('pages/productStorage/add', {
            products: productList,
            storages: storageList,
            errors: errors.array()
          })
        }
      }
      
    }
  ],
  async toStorageProductStorageForm (req, res, next) {
    try {
      const productStorage = await productStorageByIdService(req.params.id)
      let storageList = await storageListService()
      const storage = await storageByIdService(storageList.find(s => s.number === productStorage.storage).id)
      
      storageList = storageList.filter(e => e.shop === storage.shop)

      const productList = await productListService()
      if (!productStorage) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/productStorage/toStorage', { 
        productStorage: productStorage,
        storages: storageList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putToStorageProductStorage: [
    body('storage')
    .isLength({ min: 1 }).trim().withMessage('Storage field must be specified.')
    .isNumeric().withMessage('Storage field must be a number.'),
    sanitizeBody('storage').escape(),
    async (req, res, next) => {
      const productStorageData = req.body
      const productStorage = await productStorageByIdService(req.body.id)
      const storageList = await storageListService()
      const storageData = await storageList.find(s => s.number == req.body.storage)
      const productStorageList = await productStorageListService()
      const totalUsed = productStorageList.filter(ps => ps.storage == req.body.storage)
      productStorageData["product"] = productStorage.product
      if(totalUsed.length === storageData.capacity){
        req.flash('info', `Can't move product "${productStorage.product}" to storage "${req.body.storage}"`)
        res.redirect('/productStorage/list')
      } else {
        const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedProductStorage = await productStorageUpdateService(productStorageData)
          req.flash('info', `Product "${updatedProductStorage.product}" moved to storage "${updatedProductStorage.storage}"`)
          res.redirect('/productStorage/list')
        } catch (error) {
          res.render('pages/productStorage/toStorage', {
            storages: storageList,
            productStorage: productStorageData,
            newProductStorage: productStorageData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/productStorage/delete', {
          productStorage: {},
          newProductStorage: productStorageData,
          errors: errors.array()
        })
      }
      }
    }
  ],
  async toShopProductStorageForm (req, res, next) {
    try {
      const productStorage = await productStorageByIdService(req.params.id)
      const shopList = await shopListService()
      if (!productStorage) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/productStorage/toShop', { 
        productStorage: productStorage,
        shops: shopList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putToShopProductStorage: [
    body('shop')
    .isLength({ min: 1 }).trim().withMessage('Storage field must be specified.'),
    sanitizeBody('shop').escape(),
    async (req, res, next) => {
      let productShopData = req.body
      const productStorage = await productStorageByIdService(req.body.id)
      const shopList = await shopListService()
      productShopData["product"] = productStorage.product
      const shopData = await shopList.find(s => s.address == req.body.shop)
      const productShopList = await productShopListService()
      const totalUsed = productShopList.filter(ps => ps.shop == req.body.shop)
      if(totalUsed.length === shopData.capacity){
        req.flash('info', `Can't move product "${productStorage.product}" to shop "${req.body.shop}"`)
        res.redirect('/productStorage/list')
      } else {
        const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          await productStorageDeleteService(req.body)
          await productShopCreateService(productShopData)
          req.flash('info', `Product "${productStorage.product}" moved to shop "${productShopData.shop}"`)
          res.redirect('/productStorage/list')
        } catch (error) {
          res.render('pages/productStorage/toShop', {
            productStorage: productStorage,
            shops: shopList,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/productStorage/delete', {
          productStorage: {},
          productShopData: productShopData,
          errors: errors.array()
        })
      }
      }
    }
  ],
  deleteProductStorageFrom (req, res, next) {
    productStorageByIdService(req.params.id)
      .then(productStorage => {
        if (productStorage) {
          res.render('pages/productStorage/delete', { productStorage: productStorage })
        } else {
          const errorNotFound = new Error('Not found')
          errorNotFound.status = 404
          next(errorNotFound)
        }
      })
      .catch(error => {
        const errorServer = new Error(`Internal server error: ${error.message}`)
        errorServer.status = 500
        next(errorServer)
      })
  },
  deleteProductStorage (req, res, next) {
    productStorageDeleteService(req.body)
      .then(productStorage => {
        req.flash('info', `Product "${productStorage.prodcut} is deleted from storage ${productStorage.storage}`)
        res.redirect('/productStorage/list')
      })
      .catch(error => {
        res.render('pages/productStorage/delete', {
          productStorage: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
