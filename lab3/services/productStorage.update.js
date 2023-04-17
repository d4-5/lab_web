const ProductStorage = require('./../models/productStorage')

module.exports = function (data) {
  const productStorageData = {
    storage: data.storage,
    product: data.product
  }

  return new Promise((resolve, reject) => {
    ProductStorage.findByIdAndUpdate(
      data.id,
      { $set: productStorageData },
      { new: true },
      function (err, updatedProductStorage) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedProductStorage)
        }
      })
  })
}
