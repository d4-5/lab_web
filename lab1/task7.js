const model = require('task7models');
const { global_productsinstorage_list } = require('./task7models/products_in_storage');
const { global_shops_list } = require('./task7models/shop');

//storage
console.log("STORAGE");
model.add_Storage("name_of_storage1", "location_of_storage1");
model.add_Storage("name_of_storage10", "location_of_storage10");
model.add_Storage("name_of_storage2", "location_of_storage2");

console.log(model.global_storages_list);

model.edit_Storage("name_of_storage1", "location_of_storage1", "name_of_storage3", "location_of_storage3");

console.log(model.global_storages_list);

console.log(model.find_Storage("name_of_storage2", "l"));

console.log(model.remove_Storage("name_of_storage2", "location_of_storage2"));

console.log(model.global_storages_list);

//product
console.log("PRODUCT");
model.add_Product("product1", "20");
model.add_Product("product2", "40");
model.add_Product("product10", "500");

console.log(model.global_products_list);

model.edit_Product("product1", "20", "product1", "100");

console.log(model.global_products_list);

console.log(model.remove_Product("product2", "40"));

console.log(model.find_Product("product1", "100"));

console.log(model.global_products_list);

//shop
console.log("SHOP");
model.add_Shop("Shop1", "Location12", model.global_products_list);
model.add_Shop("Shop2", "Location21", []);

console.log(global_shops_list);

console.log(model.edit_Shop("Shop2", "Location21", [],"Shop3","Location21",model.global_products_list));

console.log(global_shops_list);

console.log(model.remove_Shop("Shop3", "Location21", model.global_products_list));

console.log(global_shops_list);

console.log(model.find_Shop("Shop3", "Location21", model.global_products_list))
//Products_In_Storage
console.log("PRODUCTS_IN_STORAGE");

console.log("add_Products_To_Storage");
model.add_Products_To_Storage(model.global_storages_list[0], model.global_products_list);
console.log(global_productsinstorage_list);

console.log("from_Storage_To_Storage");
model.from_Storage_To_Storage(model.global_storages_list[0], model.global_storages_list[1], model.global_products_list)
console.log(global_productsinstorage_list);

console.log("remove_Products_From_Storage");
model.remove_Products_From_Storage(model.global_storages_list[1], model.global_products_list);
console.log(global_productsinstorage_list);

console.log("from_Storage_To_Shop");
model.add_Products_To_Storage(model.global_storages_list[0], model.global_products_list);
model.from_Storage_To_Shop(model.global_storages_list[0], global_shops_list[0], model.global_products_list[0]);

console.log(global_productsinstorage_list);
console.log(global_shops_list);