const Product = require('./../models/product')

module.exports = function () {
  return new Promise((resolve, reject) => {
    Product.find({})
      .exec(function (err, products) {
        if (err) {
          reject(err)
        } else {
          resolve(products)
        }
      })
  })
}
