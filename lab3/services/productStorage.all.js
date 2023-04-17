const ProductStorage = require('./../models/productStorage')

module.exports = function () {
  return new Promise((resolve, reject) => {
    ProductStorage.find({})
      .exec(function (err, productStorages) {
        if (err) {
          reject(err)
        } else {
          resolve(productStorages)
        }
      })
  })
}
