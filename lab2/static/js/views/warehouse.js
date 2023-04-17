'use strict'

const warehouseModel = new Warehouse() // eslint-disable-line no-undef
const productWarehouseModel = new ProductWarehouse() // eslint-disable-line no-undef
const shopModel = new Shop() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#warehouse-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const warehouseData = {}
    formData.forEach((value, key) => {
      warehouseData[key] = value
    })
    
    const warehouses = warehouseModel.Select()
    const shops = shopModel.Select()
    const isNumberExist = warehouses.some(warehouse => warehouse.number === warehouseData.number)
    const isShopExist = shops.some(shop => shop.name === warehouseData.shop)

    if (!isNumberExist && isShopExist) {
      warehouseModel.Create(warehouseData)
      e.target.reset()
    } else {
      if (isNumberExist) {
        alert('Number already exists!')
      }
      if (!isShopExist) {
        alert('Shop does not exist!')
      }
    }
  })
}

function initList() {
  const warehouses = warehouseModel.Select();
  const productWarehouses = productWarehouseModel.Select();

  const warehouseCapacities = warehouses.map((warehouse) => {
    const productsInWarehouse = productWarehouses.filter(
      (pw) => pw.warehouse === warehouse.number
    );
    const totalUsedCapacity = productsInWarehouse.length;
    const usedCapacityPercent = Math.round(
      (totalUsedCapacity / warehouse.capacity) * 100
    );

    const capacityStatusClass =
      usedCapacityPercent < 20 ? "bg-danger" : "";

    return {
      ...warehouse,
      totalCapacity: warehouse.capacity,
      totalUsedCapacity: totalUsedCapacity,
      usedCapacityPercent: `<span class="${capacityStatusClass}">${usedCapacityPercent}%</span>`,
    };
  });

  window.jQuery("#warehouse-list").DataTable({
    data: warehouseCapacities,
    columns: [
      { title: "Number", data: "number" },
      { title: "Shop", data: "shop" },
      { title: "Capacity", data: "totalCapacity" },
      {
        title: "Used Capacity",
        data: "usedCapacityPercent",
      },
      {
        title: "Action",
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const editButton = `<button type="button" class="btn btn-primary btn-sm edit-warehouse" data-id="${row.id}">Edit</button>`;
          const deleteButton = `<button type="button" class="btn btn-danger btn-sm delete-warehouse" data-id="${row.id}">Delete</button>`;
          return `${editButton}&nbsp;&nbsp;${deleteButton}`;
        },
      },
    ],
  });
}

function initListEvents () {
  window.jQuery('#warehouse-list').on('click', '.delete-warehouse', function (e) {
    const warehouseId = window.jQuery(this).data('id')
    warehouseModel.Delete(warehouseId)
  })

  window.jQuery('#warehouse-list').on('click', '.edit-warehouse', function (e) {
    const warehouseId = window.jQuery(this).data('id')
    const warehouse = warehouseModel.FindById(warehouseId)

    if (warehouse) {
      const number = window.prompt('Enter a new number', warehouse.number)
      const shop = window.prompt('Enter a new shop', warehouse.shop)
      const capacity = window.prompt('Enter a new capacity', warehouse.capacity)

      if (shop !== null && capacity !== null) {
        const warehouses = warehouseModel.Select()
        const shops = shopModel.Select()
        const isNumberExist = warehouses.some(w => w.number === number && w.id !== warehouseId)
        const isShopExist = shops.some(s => s.name === shop)

        if (!isNumberExist && isShopExist) {
          warehouseModel.Update(warehouseId, { number, shop, capacity })
        } else {
          if (isNumberExist) {
            alert('Number already exists!')
          }
          if (!isShopExist) {
            alert('Shop does not exist!')
          }
        }
      }
    }
  })

  document.addEventListener('warehousesListDataChanged', function (e) {
    const dataTable = window.jQuery('#warehouse-list').DataTable()

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
