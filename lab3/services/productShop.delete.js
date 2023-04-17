const ProductShop = require('./../models/productShop')

module.exports = function (data) {
  return new Promise((resolve, reject) => {
    ProductShop.findByIdAndDelete(data.id, function (err, deletedProductShop) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedProductShop)
      }
    })
  })
}
