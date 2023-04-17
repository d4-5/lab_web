'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const productListService = require('./../services/product.all')
const productCreateService = require('./../services/product.create')
const productUpdateService = require('./../services/product.update')
const productDeleteService = require('./../services/product.delete')
const productByIdService = require('./../services/product.byId')

module.exports = {
  index (req, res) {
    res.render('pages/product/index')
  },
  async productList (req, res) {
    try {
      const productList = await productListService()
      res.render('pages/product/list', {
        products: productList
      })
    } catch (error) {
      res.render('pages/product/list', {
        products: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  createProductForm (req, res) {
    res.render('pages/product/add')
  },
  postCreateProduct: [
    body('code')
      .isLength({ min: 1 }).trim().withMessage('Code field must be specified.'),
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('country')
      .isLength({ min: 1 }).trim().withMessage('Country field must be specified.'),
    sanitizeBody('code').escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('country').escape(),
    async (req, res) => {
      const productData = req.body
      const errors = validationResult(req)

      if (errors.isEmpty()) {
        try {
          const product = await productCreateService(productData)
          req.flash('info', `Product "${product.code}" "${product.name}" "${product.country}" is Added`)
          res.redirect('/product/list')
        } catch (error) {
          res.render('pages/product/add', {
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/product/add', {
          errors: errors.array()
        })
      }
    }
  ],
  async updateProductForm (req, res, next) {
    try {
      const product = await productByIdService(req.params.id)
      if (!product) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/product/update', { product: product })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putUpdateProduct: [
    body('code')
      .isLength({ min: 1 }).trim().withMessage('Code field must be specified.'),
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('country')
      .isLength({ min: 1 }).trim().withMessage('Country field must be specified.'),
    sanitizeBody('code').escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('country').escape(),
    async (req, res, next) => {
      const productData = req.body

      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedProduct = await productUpdateService(productData)
          req.flash('info', `Product "${updatedProduct.code}" "${updatedProduct.name}" "${updatedProduct.country}" is Updated`)
          res.redirect('/product/list')
        } catch (error) {
          res.render('pages/product/update', {
            product: productData,
            newProduct: productData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/product/delete', {
          product: {},
          newProduct: productData,
          errors: errors.array()
        })
      }
    }
  ],
  deleteProductFrom (req, res, next) {
    productByIdService(req.params.id)
      .then(product => {
        if (product) {
          res.render('pages/product/delete', { product: product })
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
  deleteProduct (req, res, next) {
    productDeleteService(req.body)
      .then(product => {
        req.flash('info', `Product "${product.code} ${product.name} ${product.country}" is Deleted`)
        res.redirect('/product/list')
      })
      .catch(error => {
        res.render('pages/product/delete', {
          product: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
