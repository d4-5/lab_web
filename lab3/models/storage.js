const mongoose = require('mongoose')

const Schema = mongoose.Schema

const storageSchema = new Schema({
  number: { type: Number, required: true, unique: true, max: 999 },
  shop: { type: String, required: true, max: 250 },
  capacity: { type: Number, required: true, max: 999 }
})

module.exports = mongoose.model('Storage', storageSchema, 'storage')
