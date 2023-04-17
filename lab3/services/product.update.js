const Product = require('./../models/product')

module.exports = function (data) {
  const productData = {
    code: data.code,
    name: data.name,
    country: data.country
  }

  return new Promise((resolve, reject) => {
    Product.findByIdAndUpdate(
      data.id,
      { $set: productData },
      { new: true },
      function (err, updatedProduct) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedProduct)
        }
      })
  })
}
