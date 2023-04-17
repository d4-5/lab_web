const Product = require('./../models/product')

module.exports = function (data) {
  return new Promise((resolve, reject) => {
    Product.findByIdAndDelete(data.id, function (err, deletedProduct) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedProduct)
      }
    })
  })
}
