import { intlFormatDistance } from 'date-fns';

class Item {
  constructor(title, desc, dueDate, prio) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.prio = prio;
    this.completed = false;
  }

  getFormattedDueDate() {
    return intlFormatDistance(Date.now(), this.dueDate);
  }

  edit(newObj) {
    Object.entries(newObj).forEach(([key, value]) => {
      this[key] = value;
    });
  }
}

export default Item;
