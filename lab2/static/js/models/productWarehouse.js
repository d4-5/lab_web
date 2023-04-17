class ProductWarehouse extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('productWarehouses')
      this.fields = this.fields.concat(['warehouse', 'product'])
    }
  }
  