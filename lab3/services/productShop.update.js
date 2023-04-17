const ProductShop = require('./../models/productShop')

module.exports = function (data) {
  const productShopData = {
    shop: data.shop,
    product: data.product,
  }

  return new Promise((resolve, reject) => {
    ProductShop.findByIdAndUpdate(
      data.id,
      { $set: productShopData },
      { new: true },
      function (err, updatedProductShop) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedProductShop)
        }
      })
  })
}
