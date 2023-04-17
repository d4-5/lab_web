const ProductShop = require('./../models/productShop')

module.exports = function () {
  return new Promise((resolve, reject) => {
    ProductShop.find({})
      .exec(function (err, productShops) {
        if (err) {
          reject(err)
        } else {
          resolve(productShops)
        }
      })
  })
}
