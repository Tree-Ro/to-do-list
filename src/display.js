import { intlFormatDistance } from 'date-fns';
import { isBefore } from 'date-fns';
import { isToday } from 'date-fns';

class Display {
  static render() {
    this.appendSidebar(
      this.createSidebar(),
      document.querySelector('#side-bar')
    );
  }

  static clearPage() {
    var parent = document.getElementById('page-wrapper');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
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
      } else if (key !== 'completed' && key !== 'prio') {
        itemPart.textContent = value;
      }

      itemPart.setAttribute('class', key);
      itemWrapper.appendChild(itemPart);
      document.querySelector('body').appendChild(itemWrapper);
    }

    return itemWrapper;
  }

  static getFormattedDueDate(item) {
    return intlFormatDistance(Date.now(), item.dueDate);
  }

  static createTabWrapper(category) {
    const tabWrapper = document.createElement('div');
    tabWrapper.setAttribute('id', 'tabWrapper');

    const tabTitle = document.createElement('h2');
    tabTitle.textContent = [
      category.title + ' (' + Object.keys(category.items).length + ')',
    ];

    const addTaskBtn = document.createElement('button');
    addTaskBtn.textContent = '+ Add Task';
    addTaskBtn.setAttribute('id', 'addTaskBtn');

    const tabHeader = document.createElement('div');
    tabHeader.setAttribute('id', 'tabHeader');

    const listWrapper = document.createElement('div');
    listWrapper.setAttribute('id', 'listWrapper');

    tabHeader.appendChild(tabTitle);
    tabHeader.appendChild(addTaskBtn);
    tabWrapper.appendChild(tabHeader);
    tabWrapper.appendChild(listWrapper);
    this.appendItems(category, listWrapper);

    return tabWrapper;
  }

  static appendTabWrapper(category) {
    this.clearPage();
    const wrapper = this.createTabWrapper(category);
    document.querySelector('#page-wrapper').appendChild(wrapper);
  }

  static appendItems(category, parentNode) {
    for (const key in category.items) {
      if (category.items.hasOwnProperty(key)) {
        const item = this.createTodoItem(category.items[key]);
        parentNode.appendChild(item);
      }
    }
  }

  static createCategoryButton(localStorageIndex) {
    const category = ItemLogic.getCategorybyIndex(localStorageIndex);

    const categoryBtn = document.createElement('button');
    categoryBtn.textContent = category.title;
    categoryBtn.addEventListener('click', (event) => {
      this.appendTabWrapper(
        ItemLogic.getCategorybyName(event.target.textContent)
      );
    });

    return categoryBtn;
  }

  static createSidebar() {
    const allTasksBtn = document.createElement('button');
    allTasksBtn.textContent =
      `All Tasks ` +
      `(` +
      Object.keys(ItemLogic.getAllTasks().items).length +
      `)`;
    allTasksBtn.addEventListener('click', () => {
      this.appendTabWrapper(ItemLogic.getAllTasks());
    });

    const todayTaskBtn = document.createElement('button');
    todayTaskBtn.textContent =
      `Today's Tasks ` +
      `(` +
      Object.keys(ItemLogic.tasksDueToday().items).length +
      `)`;
    todayTaskBtn.addEventListener('click', () => {
      this.appendTabWrapper(ItemLogic.tasksDueToday());
    });

    const overdueTaskBtn = document.createElement('button');
    overdueTaskBtn.textContent =
      `Overdue Tasks ` +
      `(` +
      Object.keys(ItemLogic.tasksOverdue().items).length +
      `)`;
    overdueTaskBtn.addEventListener('click', () => {
      this.appendTabWrapper(ItemLogic.tasksOverdue());
    });

    const navContainer = document.createElement('div');
    navContainer.setAttribute('id', 'navContainer');

    navContainer.appendChild(todayTaskBtn);
    navContainer.appendChild(overdueTaskBtn);
    navContainer.appendChild(allTasksBtn);

    const categoryContainer = document.createElement('div');
    categoryContainer.setAttribute('id', 'categoryContainer');
    for (let i = 0; i < localStorage.length; i++) {
      const btn = this.createCategoryButton(i);
      categoryContainer.appendChild(btn);
    }

    const sideBarContainer = document.createElement('div');
    sideBarContainer.appendChild(navContainer);
    sideBarContainer.appendChild(categoryContainer);

    return sideBarContainer;
  }

  static appendSidebar(sidebarContent, parentNode) {
    parentNode.appendChild(sidebarContent);
  }
}

class ItemLogic {
  static getAllTasks() {
    let allItems = { title: 'All Tasks', items: {} };
    for (let i = 0; i < localStorage.length; ++i) {
      const currentCategory = this.getCategorybyIndex(i);
      for (let item in currentCategory.items) {
        allItems.items[item] = currentCategory.items[item];
      }
    }
    return allItems;
  }

  static tasksOverdue() {
    let tasksOverdue = { title: 'Overdue Tasks', items: {} };
    for (let i = 0; i < localStorage.length; ++i) {
      const currentCategory = this.getCategorybyIndex(i);
      for (let item in currentCategory.items) {
        if (isBefore(currentCategory.items[item].dueDate, Date.now() + 10)) {
          // +10 to create consistancy in when they are overdue
          tasksOverdue.items[item] = currentCategory.items[item];
        }
      }
    }
    return tasksOverdue;
  }

  static tasksDueToday() {
    let tasksDueToday = { title: "Today's Tasks", items: {} };
    for (let i = 0; i < localStorage.length; ++i) {
      const currentCategory = this.getCategorybyIndex(i);
      for (let item in currentCategory.items) {
        if (isToday(currentCategory.items[item].dueDate)) {
          tasksDueToday.items[item] = currentCategory.items[item];
        }
      }
    }
    return tasksDueToday;
  }

  static getCategorybyIndex(index) {
    const categoryTitle = localStorage.key(index);
    const category = localStorage.getItem(categoryTitle);

    return JSON.parse(category);
  }

  static getCategorybyName(name) {
    const category = localStorage[name];

    return JSON.parse(category);
  }
}

export default Display;
