const Shop = require('./../models/shop')

/**
 * @param {Object} data
 */
module.exports = function (data) {
  const shopData = {
    name: data.name,
    address: data.address,
    capacity : data.capacity
  }

  return new Promise((resolve, reject) => {
    Shop.findByIdAndUpdate(
      data.id,
      { $set: shopData },
      { new: true },
      function (err, updatedShop) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedShop)
        }
      })
  })
}
