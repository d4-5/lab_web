const ProductStorage = require('./../models/productStorage')

module.exports = function (data) {
  return new Promise((resolve, reject) => {
    ProductStorage.findByIdAndDelete(data.id, function (err, deletedProductStorage) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedProductStorage)
      }
    })
  })
}
