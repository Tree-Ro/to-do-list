class Category {
  constructor(title, prio) {
    this.title = title;
    this.prio = prio;
    this.items = {};
    this.storeCurrent();
  }

  addItem(Item) {
    if (typeof Item === 'object') {
      this.items[Item.title] = Item;
      this.storeCurrent();
    }
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
