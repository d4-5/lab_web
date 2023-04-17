const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(__dirname))

app.set('views', path.join(__dirname, '/static/views'))
app.set('view engine', 'pug')

app.get('/', function (request, response) {
  response.render('pages/index', { title: 'Home' })
})
app.get('/shop', function (request, response) {
  response.render('pages/shop', { title: 'Shop' })
})
app.get('/product', function (request, response) {
  response.render('pages/product', { title: 'Product' })
})
app.get('/warehouse', function (request, response) {
  response.render('pages/warehouse', { title: 'Warehouse' })
})
app.get('/productWarehouse', function (request, response) {
  response.render('pages/productWarehouse', { title: 'Product in warehouse' })
})
app.listen(process.env.PORT || 8080)
