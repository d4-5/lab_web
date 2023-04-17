const Product = require('./../models/product')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    Product.findById(id, function (err, product) {
      if (err) {
        reject(err)
      } else {
        resolve(product)
      }
    })
  })
}
