class Item {
  constructor(title, desc, dueDate, prio, type) {
    this.title = title;
    this.desc = desc;
    this.dueDate = new Date(dueDate); //Probably needs a fix https://date-fns.org/
    this.prio = prio;
    this.type = type;
    this.completed = false;
  }

  edit(newObj) {
    Object.entries(newObj).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}

export default Item;
