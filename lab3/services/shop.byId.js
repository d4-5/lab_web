const Shop = require('./../models/shop')

/**
 * @param {Object} data
 */
module.exports = function (id) {
  return new Promise((resolve, reject) => {
    Shop.findById(id, function (err, shop) {
      if (err) {
        reject(err)
      } else {
        resolve(shop)
      }
    })
  })
}
