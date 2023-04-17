'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const productStorageListService = require('./../services/productStorage.all')
const productStorageCreateService = require('./../services/productStorage.create')

function _getMockProductStorage (id = null) {
  return {
    storage: 50,
    product: 'Prod1',
  }
}

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
  createProductStorageForm (req, res) {
    res.render('pages/productStorage/add')
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

        if (errors.isEmpty()) {
          try {
            const productStorage = await productStorageCreateService(productStorageData)
            req.flash('info', `Product "${productStorage.product}" "${productStorage.storage}" is Added`)
            res.redirect('/productStorage/list')
        } catch (error) {
          res.render('pages/productStorage/add', {
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/productStorage/add', {
          errors: errors.array()
        })
      }
    }
  ],
  updateProductStorageForm (req, res) {
    const mockProductStorage = _getMockProductStorage(req.body.id)

    res.render('pages/productStorage/update', { productStorage: mockProductStorage })
  },
  putUpdateProductStorage (req, res) {
    const success = true
    const productStorageData = req.body
    const mockProductStorage = _getMockProductStorage(productStorageData.id)

    if (success) {
      req.flash('info', `Product "#${productStorageData.product} ${productStorageData.storage}" is Updated`)
      res.redirect('/productStorage/list')
    } else {
      res.render('pages/productStorage/update', {
        productStorage: mockProductStorage,
        newProductStorage: productStorageData,
        errors: [{ 'msg': 'Error Omg' }]
      })
    }
  },
  deleteProductStorageFrom (req, res) {
    const mockProductStorage = _getMockProductStorage(req.body.id)

    res.render('pages/productStorage/delete', { productStorage: mockProductStorage })
  },
  deleteProductStorage (req, res) {
    const success = true
    const productStorageData = req.body
    const mockProductStorage = _getMockProductStorage(productStorageData.id)

    if (success) {
      req.flash('info', `Product "#${productStorageData.product} ${productStorageData.storage}" is Deleted`)
      res.redirect('/productStorage/list')
    } else {
      res.render('pages/productStorage/delete', {
        productStorage: mockProductStorage,
        errors: [{ 'msg': 'Error Omg' }]
      })
    }
  }
}
