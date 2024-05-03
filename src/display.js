import { intlFormatDistance } from 'date-fns';

class Display {
  static render() {
    //all rendering logic for the full page
  }

  static createTodoItem(itemObj) {
    let itemWrapper = document.createElement('div');
    itemWrapper.setAttribute('class', 'item-wrapper');

    let itemPart;

    for (const [key, value] of Object.entries(itemObj)) {
      if (key === 'prio') {
        itemPart = document.createElement('button');
      } else if (key !== 'completed') {
        itemPart = document.createElement('div');
      }

      itemPart.setAttribute('class', key);

      if (key === 'dueDate') {
        itemPart.textContent = this.getFormattedDueDate(itemObj);
      } else {
        itemPart.textContent = value;
      }

      itemWrapper.appendChild(itemPart);
    }

    return itemWrapper;
  }

  static getFormattedDueDate(item) {
    return intlFormatDistance(Date.now(), item.dueDate);
  }
}

export default Display;
