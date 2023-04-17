const Storage = require('./../models/storage')

module.exports = function (id) {
  return new Promise((resolve, reject) => {
    Storage.findById(id, function (err, storage) {
      if (err) {
        reject(err)
      } else {
        resolve(storage)
      }
    })
  })
}
