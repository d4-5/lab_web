const ProductShop = require('./../models/productShop')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    ProductShop.findById(id, function (err, productShop) {
      if (err) {
        reject(err)
      } else {
        resolve(productShop)
      }
    })
  })
}
