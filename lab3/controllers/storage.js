'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const storageListService = require('./../services/storage.all')
const storageCreateService = require('./../services/storage.create')
const storageUpdateService = require('./../services/storage.update')
const storageDeleteService = require('./../services/storage.delete')
const storageByIdService = require('./../services/storage.byId')
const shopListService = require('./../services/shop.all')
const productStorageListService = require('./../services/productStorage.all')

module.exports = {
  index (req, res) {
    res.render('pages/storage/index')
  },
  async storageList (req, res) {
    try {
      const storageList = await storageListService()
      const productStorageList = await productStorageListService()
      
      const newStorageList = storageList.map((storage) => {
        
        const productsInStorage = productStorageList.filter((ps) => ps.storage === storage.number);
        const totalUsedCapacity = productsInStorage.length;
        const percentUsed = totalUsedCapacity / storage.capacity * 100;
  
        return {
          number : storage.number,
          shop : storage.shop,
          capacity : storage.capacity,
          percentUsed: percentUsed,
        };
      });
      
      res.render('pages/storage/list', {
        storages: newStorageList,
      })
    } catch (error) {
      res.render('pages/storage/list', {
        storages: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  async createStorageForm (req, res) {
    try {
      const shopList = await shopListService()
      res.render('pages/storage/add', { shops: shopList })
    } catch (error) {
      res.render('pages/storage/list', {
        shops: shopList,
        errors: [{ msg: error.message }]
      })
    }
  },
  postCreateStorage: [
    body('number')
      .isLength({ min: 1 }).trim().withMessage('Number field must be specified.')
      .isNumeric().withMessage('Number field must be a number.'),
    body('shop')
      .isLength({ min: 1 }).trim().withMessage('Shop field must be specified.'),
    body('capacity')
      .isLength({ min: 1 }).trim().withMessage('Capacity field must be specified.')
      .isNumeric().withMessage('Capacity field must be a number.'),
    sanitizeBody('number').escape(),
    sanitizeBody('shop').escape(),
    sanitizeBody('capacity').escape(),
    async (req, res) => {
      const storageData = req.body
      const errors = validationResult(req)
      const shopList = await shopListService()
      if (errors.isEmpty()) {
        try {
          const storage = await storageCreateService(storageData)
          req.flash('info', `Storage "${storage.number}" "${storage.shop}" "${storage.capacity}" is Added`)
          res.redirect('/storage/list')
        } catch (error) {
          res.render('pages/storage/add', {
            shops: shopList,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/storage/add', {
          shops: shopList,
          errors: errors.array()
        })
      }
    }
  ],
  async updateStorageForm (req, res, next) {
    try {
      const storage = await storageByIdService(req.params.id)
      const shopList = await shopListService()
      if (!storage) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/storage/update', {
        newStorage: storage,
        storage: storage,
        shops: shopList
       })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putUpdateStorage: [
    body('number')
      .isLength({ min: 1 }).trim().withMessage('Number field must be specified.')
      .isNumeric().withMessage('Number field must be a number.'),
    body('shop')
      .isLength({ min: 1 }).trim().withMessage('Shop field must be specified.'),
    body('capacity')
      .isLength({ min: 1 }).trim().withMessage('Capacity field must be specified.')
      .isNumeric().withMessage('Capacity field must be a number.'),
    sanitizeBody('number').escape(),
    sanitizeBody('shop').escape(),
    sanitizeBody('capacity').escape(),
    async (req, res, next) => {
      const storageData = req.body
      const shopList = await shopListService()
      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedStorage = await storageUpdateService(storageData)
          req.flash('info', `Storage "${updatedStorage.number}" "${updatedStorage.shop}" "${updatedStorage.capacity}" is Updated`)
          res.redirect('/storage/list')
        } catch (error) {
          res.render('pages/storage/update', {
            shops: shopList,
            storage: storageData,
            newStorage: storageData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/storage/list', {
          shops: shopList,
          storage: storageData,
          newStorage: storageData,
          errors: errors.array()
        })
      }
    }
  ],
  deleteStorageFrom (req, res, next) {
    storageByIdService(req.params.id)
      .then(storage => {
        if (storage) {
          res.render('pages/storage/delete', { storage: storage })
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
  deleteStorage (req, res, next) {
    storageDeleteService(req.body)
      .then(storage => {
        req.flash('info', `Storage "${storage.name} ${storage.address} ${storage.capacity}" is Deleted`)
        res.redirect('/storage/list')
      })
      .catch(error => {
        res.render('pages/storage/delete', {
          storage: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
