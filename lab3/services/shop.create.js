const Shop = require('./../models/shop')

/**
 * @param {Object} data
 */
module.exports = function (data) {
  const shop = new Shop({
    name: data.name,
    address : data.address,
    capacity: data.capacity,
  })

  return new Promise((resolve, reject) => {
    shop.save(function (err, createdShop) {
      if (err) {
        reject(err)
      } else {
        resolve(createdShop)
      }
    })
  })
}
