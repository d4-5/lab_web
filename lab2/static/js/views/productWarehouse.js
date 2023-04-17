'use strict'

const productModel = new Product();// eslint-disable-line no-undef
const warehouseModel = new Warehouse();// eslint-disable-line no-undef
const productWarehouseModel = new ProductWarehouse();// eslint-disable-line no-undef

function initAddForm () {
  const productSelect = window.jQuery('#product')
  const warehouseSelect = window.jQuery('#warehouse')

  const products = productModel.Select()
  products.forEach(product => {
    productSelect.append('<option value="' + product.code + '">' + product.code + '</option>')
  })

  const warehouses = warehouseModel.Select()
  warehouses.forEach(warehouse => {
    warehouseSelect.append('<option value="' + warehouse.number + '">' + warehouse.number + '</option>')
  })

  const form = window.jQuery('#productWarehouse-add-form')
  form.on('submit', function (e) {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const productWarehouseData = {}
    formData.forEach((value, key) => {
      productWarehouseData[key] = value
    })

    productWarehouseModel.Create(productWarehouseData)

    e.target.reset()
  })
}


function initList () {
  window.jQuery('#productWarehouse-list').DataTable({
    data: productWarehouseModel.Select(),
    columns: [
      { title: 'Warehouse', data: 'warehouse' },
      { title: 'Product', data: 'product' },
      {
        title: 'Action',
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const transferButton = '<button type="button" class="btn btn-primary btn-sm transfer-productWarehouse" data-id="' + row.id + '">Transfer</button>';
          const deleteButton = '<button type="button" class="btn btn-danger btn-sm delete-productWarehouse" data-id="' + row.id + '">Delete</button>';
          return transferButton + '&nbsp;&nbsp;' + deleteButton;
        }
      }
    ]
  })
}

function initListEvents () {
  window.jQuery('#productWarehouse-list').on('click', '.delete-productWarehouse', function (e) {
    const productWarehouseId = window.jQuery(this).data('id')
    productWarehouseModel.Delete(productWarehouseId)
  })

  window.jQuery('#productWarehouse-list').on('click', '.transfer-productWarehouse', function (e) {
    const productWarehouseId = window.jQuery(this).data('id')
    const productWarehouse = productWarehouseModel.FindById(productWarehouseId)

    const currentWarehouse = warehouseModel.Select().find(warehouse => warehouse.number === productWarehouse.warehouse)
    const currentShop = currentWarehouse.shop

    const newWarehouseNumber = window.prompt('Enter a new warehouse number:', productWarehouse.warehouse)
    const newWarehouse = warehouseModel.Select().find(warehouse => warehouse.number === newWarehouseNumber)
    if (!newWarehouse){
      window.alert('The warehouse does not exist')
      return
    }
    const newShop = newWarehouse.shop

    if (currentShop !== newShop) {
      window.alert('The warehouses belong to different shops. Transfer is not allowed.')
      return
    }

    productWarehouseModel.Update(productWarehouseId, {warehouse : newWarehouseNumber, product : productWarehouse.product})
  })

  document.addEventListener('productWarehousesListDataChanged', function (e) {
    const dataTable = window.jQuery('#productWarehouse-list').DataTable()

    dataTable.clear()
    dataTable.rows.add(e.detail)
    dataTable.draw()
  }, false)
}


window.addEventListener('DOMContentLoaded', e => {
  initAddForm()
  initList()
  initListEvents()
})
