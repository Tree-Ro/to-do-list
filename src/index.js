import './style.css';
import Item from './item.js';
import Category from './category.js';
import Display from './display.js';
import { ItemLogic } from './display.js';

const myCategory = new Category('Tasks', 1);
myCategory.addItem(new Item('Groceries', 'Buy Cheese & Egg', Date.now(), 2));
myCategory.addItem(
  new Item(
    'Apple-things',
    'Rosemary marinated apples!',
    Date.now() - 1000000000,
    '1'
  )
);
myCategory.addItem(new Item('Pear-things', 'Pear Jam!', 1714729101683, '1'));

const example = new Category('nooo', 1);
example.addItem(new Item('uff', 'e & Egg', Date.now(), 2));

Display.appendTabWrapper(ItemLogic.tasksOverdue());
console.log(myCategory);

console.log(ItemLogic.tasksDueToday());
console.log(ItemLogic.tasksOverdue());
console.log(ItemLogic.getAllTasks());

Display.appendSidebar(
  Display.createSidebar(),
  document.querySelector('#side-bar')
);
//Copy this design? https://lakeebs.github.io/taskr/
