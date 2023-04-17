const Storage = require('./../models/storage')

module.exports = function (data) {
  return new Promise((resolve, reject) => {
    Storage.findByIdAndDelete(data.id, function (err, deletedStorage) {
      if (err) {
        reject(err)
      } else {
        resolve(deletedStorage)
      }
    })
  })
}
