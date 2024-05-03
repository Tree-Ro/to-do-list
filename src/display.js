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

      if (key === 'dueDate') {
        itemPart.textContent = this.getFormattedDueDate(itemObj);
      } else {
        itemPart.textContent = value;
      }

      itemPart.setAttribute('class', key);
      itemWrapper.appendChild(itemPart);
      document.querySelector('body').appendChild(itemWrapper);
    }

    return itemWrapper;
  }

  static createTabWrapper(category) {
    const tabWrapper = document.createElement('div');
    tabWrapper.setAttribute('id', 'tabWrapper');

    const tabTitle = document.createElement('h2');
    tabTitle.textContent = [
      category.title + '(' + Object.keys(category).length + ')',
    ];

    const addTaskBtn = document.createElement('button');
    addTaskBtn.textContent = '+ Add Task';
    addTaskBtn.setAttribute('id', 'addTaskBtn');

    const listWrapper = document.createElement('div');
    listWrapper.setAttribute('id', 'listWrapper');

    tabWrapper.appendChild(tabTitle);
    tabWrapper.appendChild(addTaskBtn);
    tabWrapper.appendChild(listWrapper);
    this.appendItems(category, tabWrapper);

    return tabWrapper;
  }

  static appendTabWrapper(category) {
    const wrapper = this.createTabWrapper(category);
    document.querySelector('body').appendChild(wrapper);
  }

  static appendItems(category, parentNode) {
    for (const key in category.items) {
      if (category.items.hasOwnProperty(key)) {
        const item = this.createTodoItem(category.items[key]);
        parentNode.appendChild(item);
      }
    }
  }

  static getFormattedDueDate(item) {
    return intlFormatDistance(Date.now(), item.dueDate);
  }
}

export default Display;
