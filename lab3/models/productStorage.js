const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productStorageSchema = new Schema({
  storage: { type: Number, required: true, max: 999 },
  product: { type: String, required: true, max: 250 }
})

module.exports = mongoose.model('ProductStorage', productStorageSchema, 'productStorage')
