'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const productShopListService = require('./../services/productShop.all')
const productShopCreateService = require('./../services/productShop.create')

function _getMockProductShop (id = null) {
  return {
    shop: 'Shop1',
    product: 'Product1',
  }
}

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
  createProductShopForm (req, res) {
    res.render('pages/productShop/add')
  },
  postCreateProductShop: [
    body('shop')
      .isLength({ min: 1 }).trim().withMessage('Shop field must be specified.'),
    body('product')
      .isLength({ min: 1 }).trim().withMessage('Product field must be specified.'),
    sanitizeBody('shop').escape(),
    sanitizeBody('product').escape(),
    async (req, res) => {

        const productShopData = req.body
        const errors = validationResult(req)

        if (errors.isEmpty()) {
          try {
            const productShop = await productShopCreateService(productShopData)
            req.flash('info', `ProductShop "${productShop.shop}" "${productShop.product}" is Added`)
            res.redirect('/productShop/list')
        } catch (error) {
          res.render('pages/productShop/add', {
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/productShop/add', {
          errors: errors.array()
        })
      }
    }
  ],
  updateProductShopForm (req, res) {
    const mockProductShop = _getMockProductShop(req.body.id)

    res.render('pages/productShop/update', { productShop: mockProductShop })
  },
  putUpdateProductShop (req, res) {
    const success = true
    const productShopData = req.body
    const mockProductShop = _getMockProductShop(productShopData.id)

    if (success) {
      req.flash('info', `ProductShop "#${productShopData.shop} ${productShopData.product}" is Updated`)
      res.redirect('/productShop/list')
    } else {
      res.render('pages/productShop/update', {
        productShop: mockProductShop,
        newProductShop: productShopData,
        errors: [{ 'msg': 'Error Omg' }]
      })
    }
  },
  deleteProductShopFrom (req, res) {
    const mockProductShop = _getMockProductShop(req.body.id)

    res.render('pages/productShop/delete', { productShop: mockProductShop })
  },
  deleteProductShop (req, res) {
    const success = true
    const productShopData = req.body
    const mockProductShop = _getMockProductShop(productShopData.id)

    if (success) {
      req.flash('info', `ProductShop "#${productShopData.shop} ${productShopData.product}" is Deleted`)
      res.redirect('/productShop/list')
    } else {
      res.render('pages/productShop/delete', {
        storage: mockProductShop,
        errors: [{ 'msg': 'Error Omg' }]
      })
    }
  }
}