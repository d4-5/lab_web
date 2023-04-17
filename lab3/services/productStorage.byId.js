const ProductStorage = require('./../models/productStorage')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    ProductStorage.findById(id, function (err, productStorage) {
      if (err) {
        reject(err)
      } else {
        resolve(productStorage)
      }
    })
  })
}
