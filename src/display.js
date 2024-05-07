import { intlFormatDistance } from 'date-fns';
import { isBefore } from 'date-fns';
import { isToday } from 'date-fns';
import { format } from 'date-fns';
import Category from './category.js';
import Item from './item.js';

class Display {
  static render(category) {
    this.clearSidebar();
    this.appendSidebar(
      this.createSidebar(),
      document.querySelector('#side-bar')
    );

    this.appendTabWrapper(category);
  }

  static clearPage() {
    var parent = document.getElementById('page-wrapper');
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  static clearSidebar() {
    var parent = document.getElementById('side-bar');
    parent.removeChild(parent.lastChild);
  }

  static createTodoItem(itemObj) {
    let itemWrapper = document.createElement('div');
    itemWrapper.setAttribute('class', 'item-wrapper');
    let itemPart;

    for (const [key, value] of Object.entries(itemObj)) {
      if (key === 'prio') {
        itemPart = document.createElement('button');

        itemPart.addEventListener('click', () => {
          console.log(ItemLogic.getCategorybyItem(itemObj.title));
          const tempTitle = ItemLogic.getCategorybyItem(itemObj.title).title;
          const tempItems = ItemLogic.getCategorybyItem(itemObj.title).items;
          const newObj = new Category(tempTitle, tempItems);
          newObj.items = tempItems;
          newObj.deleteItem(itemObj);
          Display.render(newObj);
        });
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
    return intlFormatDistance(item.dueDate, Date.now());
  }

  static createTabWrapper(category) {
    const tabWrapper = document.createElement('div');
    tabWrapper.setAttribute('id', 'tabWrapper');

    const tabTitle = document.createElement('h2');
    tabTitle.textContent = [
      category.title + ' (' + Object.keys(category.items).length + ')',
    ];

    const tabHeader = document.createElement('div');
    tabHeader.setAttribute('id', 'tabHeader');

    const listWrapper = document.createElement('div');
    listWrapper.setAttribute('id', 'listWrapper');

    tabHeader.appendChild(tabTitle);
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
    categoryBtn.textContent =
      category.title + ` (${Object.keys(category.items).length})`;
    categoryBtn.addEventListener('click', (event) => {
      this.appendTabWrapper(
        ItemLogic.getCategorybyName(`${event.target.textContent.split(' ')[0]}`)
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
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = 'Categories';
    categoryContainer.appendChild(categoryTitle);

    for (let i = 0; i < localStorage.length; i++) {
      const btn = this.createCategoryButton(i);
      categoryContainer.appendChild(btn);
    }

    const sideBarContainer = document.createElement('div');
    sideBarContainer.appendChild(navContainer);
    sideBarContainer.appendChild(categoryContainer);

    return sideBarContainer;
  }

  static toggleCreateCategoryListener() {
    const container = document.querySelector('#categoryContainer');

    // Add the 'Add Category' button
    container.insertAdjacentHTML(
      'beforeend',
      `<button id="addCategoryBtn">+ Add Category</button>`
    );

    const addCategoryBtn = document.querySelector('#addCategoryBtn');

    // Function to handle 'Add Category' button click
    const addCategoryBtnClickHandler = () => {
      // Remove the 'Add Category' button
      container.removeChild(container.lastChild);

      container.insertAdjacentHTML(
        'beforeend',
        `
            <div>
                <button id="close-add-category">X</button>
                <input id="enterCategoryNameInput" type="text" name="new-category" placeholder="Category name + [Enter]" maxlength="20" required>
            </div>`
      );
      document.querySelector('#enterCategoryNameInput').onkeypress = function (
        e
      ) {
        // Check if the pressed key is a space
        if (e.which === 32 || e.keyCode === 32) {
          e.preventDefault();
        }
      };

      document
        .querySelector('#enterCategoryNameInput')
        .addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            new Category(event.target.value, {});
            this.render();
          }
        });

      // Add event listener to the close button
      document
        .querySelector('#close-add-category')
        .addEventListener('click', () => {
          // Remove the input field
          container.removeChild(container.lastChild);
          this.toggleCreateCategoryListener();
        });
    };

    // Add event listener to 'Add Category' button
    addCategoryBtn.addEventListener('click', addCategoryBtnClickHandler);
  }

  static addAddTaskListener() {
    function taskCreatePopup(event) {
      if (event.target.id === 'closed') {
        event.target.setAttribute('id', 'open');

        function generateLocationOptions() {
          let optionsHTML = '';
          let categoryTitles = [];
          for (let i = 0; i < localStorage.length; i++) {
            categoryTitles[i] = ItemLogic.getCategorybyIndex(i).title;
          }

          categoryTitles.forEach((category) => {
            optionsHTML += `<option value="${category}">${category}</option>`;
          });
          return optionsHTML;
        }

        event.target.insertAdjacentHTML(
          'afterend',
          `
        <form id="addTaskForm" method="dialog">
          <input name="task-name" class="task-name" placeholder="Task name (required)" maxlength="30" autocomplete="off" pattern="^(?!.*\\s{2}).*$" required="">
          <textarea name="task-notes" class="task-notes" pattern="^(?!.*\\s{2}).*$" placeholder="Notes (optional)" rows="4" maxlength="200"></textarea>
          <input type="date" name="due-date" class="due-date" required="" value="${format(
            new Date(),
            'yyyy-MM-dd'
          )}" min="${format(new Date(), 'yyyy-MM-dd')}">
          <select name="priority" class="priority">
            <option value="No Priority" selected="selected">No priority</option>
            <option value="Priority 1">Priority 1</option>
            <option value="Priority 2">Priority 2</option>
            <option value="Priority 3">Priority 3</option>
          </select>
          <select name="location" class="location">
            ${generateLocationOptions()}
          </select>
          <div class="buttons">
            <button type="submit" class="close" formnovalidate="">Close</button>
            <button type="submit" class="add">Add</button>
          </div>
        </form>
        `
        );
        document.querySelector('.close').addEventListener('click', () => {
          event.target.setAttribute('id', 'closed');
          document.querySelector('#addTaskForm').remove();
        });
        document.querySelector('.add').addEventListener('click', () => {
          const form = document.querySelector('#addTaskForm');
          const formData = new FormData(form);
          const itemData = [];

          for (let pair of formData) {
            if (pair[0] === 'task-name' && pair[1] === '') {
              return;
            }
            itemData.push(pair[1]);
          }

          const retrievedCategory = ItemLogic.getCategorybyName(
            itemData[itemData.length - 1]
          );
          const category = new Category(retrievedCategory.title);
          category.items = retrievedCategory.items;

          category.addItem(new Item(...itemData));
          category.storeCurrent();
          Display.render(category);
          event.target.setAttribute('id', 'closed');
          document.querySelector('#addTaskForm').remove();
        });
      } else if (event.target.id === 'open') {
        event.target.setAttribute('id', 'closed');
        document.querySelector('#addTaskForm').remove();
      }
    }

    const addTaskBtn = document.querySelector('#add-task');

    if (!addTaskBtn.hasAttribute('data-listener-added')) {
      addTaskBtn.addEventListener('click', taskCreatePopup);
      addTaskBtn.setAttribute('data-listener-added', true);
    }
  }

  static addEditTaskListener() {
    //Form
    //Input Task Name (Required)
    //Input Notes (Optional)
    //Input type date
    //Checkbox priority
    //////Options *4
    //Select Category
    //////buncha stuff(???)
    //Buttons Submit/Close
  }

  static appendSidebar(sidebarContent, parentNode) {
    parentNode.appendChild(sidebarContent);
    this.toggleCreateCategoryListener();
    this.addAddTaskListener();
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
    const category = localStorage.getItem(name);
    const parsedCategory = JSON.parse(category);
    return parsedCategory;
  }

  static getCategorybyItem(itemTitle) {
    for (let i = 0; i < localStorage.length; i++) {
      for (let item in this.getCategorybyIndex(i).items) {
        if (item === itemTitle) {
          return this.getCategorybyIndex(i);
        }
      }
    }
  }
}

export default Display;
