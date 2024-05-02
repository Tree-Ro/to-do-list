class Category {
  constructor(title, prio) {
    this.title = title;
    this.prio = prio;
    this.items = {};
  }

  addItem(Item) {
    if (typeof Item === 'object') {
      this.items = Item;
    }
  }

  edit(newObj) {
    Object.entries(newObj).forEach(([key, value]) => {
      if (!(key === 'items')) {
        this[key] = value;
      }
    });
  }
}

export default Category;
