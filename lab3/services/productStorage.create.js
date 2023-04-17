const ProductStorage = require('./../models/productStorage')

module.exports = function (data) {
  const productStorage = new ProductStorage({
    storage: data.storage,
    product: data.product
  })

  return new Promise((resolve, reject) => {
    productStorage.save(function (err, createdProductStorage) {
      if (err) {
        reject(err)
      } else {
        resolve(createdProductStorage)
      }
    })
  })
}
