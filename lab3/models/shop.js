const mongoose = require('mongoose')

const Schema = mongoose.Schema

const shopSchema = new Schema({
  name: { type: String, required: true, max: 250 },
  address: { type: String, required: true, unique: true, max: 250 },
  capacity: { type: Number, required: true, max: 999 }
})

module.exports = mongoose.model('Shop', shopSchema, 'shop')
