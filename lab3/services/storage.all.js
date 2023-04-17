const Storage = require('./../models/storage')

module.exports = function () {
  return new Promise((resolve, reject) => {
    Storage.find({})
      .exec(function (err, storages) {
        if (err) {
          reject(err)
        } else {
          resolve(storages)
        }
      })
  })
}
