const Shop = require('./../models/shop')

/**
 * @param {Object} data
 */
module.exports = function () {
  return new Promise((resolve, reject) => {
    Shop.find({})
      .exec(function (err, shops) {
        if (err) {
          reject(err)
        } else {
          resolve(shops)
        }
      })
  })
}
