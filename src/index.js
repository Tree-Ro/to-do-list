import Item from './item.js';
import Category from './category.js';

const myItem = new Item(
  'Groceries',
  'Buy Cheese & Egg',
  Date.now(),
  2,
  'checklist'
);
console.log(myItem);
myItem.edit({ title: 'newTestTitle', desc: '' });
console.log(myItem);

const myCategory = new Category('Tasks', 1);
console.log(myCategory);
myCategory.addItem(myItem);
myCategory.edit({ title: 'Groceries', prio: 4 });
console.log(myCategory);
//Check if user has localstorage todoList
//  if so Load localstorage todoList
//else render home page

//Create items through classes
//Create projects through classes
//Store items in categories
//      item contains:
//          {title:str, description:str, dueDate:new Date, priority:1-5, type:checklist vs Notes ????,}
//      category contains:
//          {title:str, items:{}, priority:1-5,}

//createCategory(...args)
//getAllCategories()
//editCategory()
//deleteCategory()

//Copy this design? https://lakeebs.github.io/taskr/
