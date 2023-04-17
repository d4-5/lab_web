class Warehouse extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('warehouses')
      this.fields = this.fields.concat(['number','shop', 'capacity'])
    }
  }
  