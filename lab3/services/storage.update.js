const Storage = require('./../models/storage')

module.exports = function (data) {
  const storageData = {
    number: data.number,
    shop: data.shop,
    capacity : data.capacity
  }

  return new Promise((resolve, reject) => {
    Storage.findByIdAndUpdate(
      data.id,
      { $set: storageData },
      { new: true },
      function (err, updatedStorage) {
        if (err) {
          reject(err)
        } else {
          resolve(updatedStorage)
        }
      })
  })
}
