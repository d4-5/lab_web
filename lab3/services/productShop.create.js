const ProductShop = require('./../models/productShop')

module.exports = function (data) {
  const productShop = new ProductShop({
    shop: data.shop,
    product: data.product,
  })

  return new Promise((resolve, reject) => {
    productShop.save(function (err, createdProductShop) {
      if (err) {
        reject(err)
      } else {
        resolve(createdProductShop)
      }
    })
  })
}
