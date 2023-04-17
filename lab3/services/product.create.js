const Product = require('./../models/product')

module.exports = function (data) {
  const product = new Product({
    code: data.code,
    name: data.name,
    country: data.country,
  })

  return new Promise((resolve, reject) => {
    product.save(function (err, createdProduct) {
      if (err) {
        reject(err)
      } else {
        resolve(createdProduct)
      }
    })
  })
}
