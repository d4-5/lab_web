const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  code: { type: String, required: true, unique: true, max: 250 },
  name: { type: String, required: true, max: 250 },
  country: { type: String, required: true, max: 250 },
})

module.exports = mongoose.model('Product', productSchema, 'product')
