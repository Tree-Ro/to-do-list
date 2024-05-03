import Item from './item.js';
import Category from './category.js';
import Display from './display.js';

const myItem = new Item(
  'Groceries',
  'Buy Cheese & Egg',
  Date.now(),
  2,
  'checklist'
);

const myCategory = new Category('Tasks', 1);
myCategory.addItem(myItem);

myCategory.addItem(
  new Item('Apple-things', 'Rosemary marinated apples!', Date.now(), '1')
);
console.log(myCategory);

console.log(
  Display.createTodoItem(
    new Item('Apple-things', 'Rosemary marinated apples!', Date.now(), '5')
  )
);
//Check if user has localstorage todoList
//  if so Load localstorage todoList
//else render home page

//Create items through classes
//Create projects through classes
//Store items in categories
//      item contains:
//          {title:str, description:str, dueDate:new Date, priority:1-5}
//      category contains:
//          {title:str, items:{}, priority:1-5,}

//createCategory(...args)
//getAllCategories()
//editCategory()
//deleteCategory()

//Copy this design? https://lakeebs.github.io/taskr/
