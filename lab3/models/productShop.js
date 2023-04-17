const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productShopSchema = new Schema({
  shop: { type: String, required: true, max: 250 },
  product: { type: String, required: true, max: 250 },
})

module.exports = mongoose.model('ProductShop', productShopSchema, 'productShop')
