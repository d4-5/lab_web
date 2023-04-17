const Storage = require('./../models/storage')

module.exports = function (data) {
  const storage = new Storage({
    number: data.number,
    shop: data.shop,
    capacity: data.capacity,
  })

  return new Promise((resolve, reject) => {
    storage.save(function (err, createdStorage) {
      if (err) {
        reject(err)
      } else {
        resolve(createdStorage)
      }
    })
  })
}
