'use strict'

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

const shopListService = require('./../services/shop.all')
const shopCreateService = require('./../services/shop.create')
const shopUpdateService = require('./../services/shop.update')
const shopDeleteService = require('./../services/shop.delete')
const shopByIdService = require('./../services/shop.byId')

module.exports = {
  index (req, res) {
    res.render('pages/shop/index')
  },
  async shopList (req, res) {
    try {
      const shopList = await shopListService()
      res.render('pages/shop/list', {
        shops: shopList
      })
    } catch (error) {
      res.render('pages/shop/list', {
        shops: [],
        errors: [{ msg: error.message }]
      })
    }
  },
  createShopForm (req, res) {
    res.render('pages/shop/add')
  },
  postCreateShop: [
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('address')
      .isLength({ min: 1 }).trim().withMessage('Address field must be specified.'),
    body('capacity')
      .isLength({ min: 1 }).trim().withMessage('Capacity field must be specified.'),
    sanitizeBody('name').escape(),
    sanitizeBody('address').escape(),
    sanitizeBody('capacity').escape(),
    async (req, res) => {
      const shopData = req.body
      const errors = validationResult(req)

      if (errors.isEmpty()) {
        try {
          const shop = await shopCreateService(shopData)
          req.flash('info', `Shop "${shop.name}" "${shop.address}" "${shop.capacity}" is Added`)
          res.redirect('/shop/list')
        } catch (error) {
          res.render('pages/shop/add', {
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/shop/add', {
          errors: errors.array()
        })
      }
    }
  ],
  async updateShopForm (req, res, next) {
    try {
      const shop = await shopByIdService(req.params.id)
      if (!shop) {
        const errorServer = new Error('Not found')
        errorServer.status = 404
        next(errorServer)
        return
      }
      res.render('pages/shop/update', { shop: shop })
    } catch (error) {
      const errorServer = new Error(`Internal server error: ${error.message}`)
      errorServer.status = 500
      next(errorServer)
    }
  },
  putUpdateShop: [
    body('name')
      .isLength({ min: 1 }).trim().withMessage('Name field must be specified.'),
    body('address')
      .isLength({ min: 1 }).trim().withMessage('Address field must be specified.'),
    body('capacity')
      .isLength({ min: 1 }).trim().withMessage('Capacity field must be specified.'),
    sanitizeBody('name').escape(),
    sanitizeBody('address').escape(),
    sanitizeBody('capacity').escape(),
    async (req, res, next) => {
      const shopData = req.body

      const errors = validationResult(req)
      if (errors.isEmpty()) {
        try {
          const updatedShop = await shopUpdateService(shopData)
          req.flash('info', `Shop "${updatedShop.name} ${updatedShop.address} ${updatedShop.capacity}" is Updated`)
          res.redirect('/shop/list')
        } catch (error) {
          res.render('pages/shop/update', {
            shop: shopData,
            newShop: shopData,
            errors: [{ msg: error.message }]
          })
        }
      } else {
        res.render('pages/shop/list', {
          shop: {},
          newShop: shopData,
          errors: errors.array()
        })
      }
    }
  ],
  deleteShopFrom (req, res, next) {
    shopByIdService(req.params.id)
      .then(shop => {
        if (shop) {
          res.render('pages/shop/delete', { shop: shop })
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
  deleteShop (req, res, next) {
    shopDeleteService(req.body)
      .then(shop => {
        req.flash('info', `Shop "${shop.name} ${shop.address} ${shop.capacity}" is Deleted`)
        res.redirect('/shop/list')
      })
      .catch(error => {
        res.render('pages/shop/delete', {
          shop: req.body,
          errors: [{ msg: error.message }]
        })
      })
  }
}
