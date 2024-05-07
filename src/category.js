class Category {
  constructor(title, itemsObj) {
    this.title = title;
    this.items = itemsObj;
    this.storeCurrent();
  }

  addItem(Item) {
    if (typeof Item === 'object') {
      this.items[Item.title] = Item;
      this.storeCurrent();
    }
  }

  deleteItem(Item) {
    delete this.items[Item.title];
    this.storeCurrent();
  }

  storeCurrent() {
    localStorage[this.title] = JSON.stringify(this);
  }

  edit(newObj) {
    Object.entries(newObj).forEach(([key, value]) => {
      if (!(key === 'items')) {
        this[key] = value;
      }
    });
    this.storeCurrent();
  }

  deleteCategory() {
    delete localStorage[this.title];
  }
}

export default Category;
