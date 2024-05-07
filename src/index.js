import './style.css';
import Item from './item.js';
import Category from './category.js';
import Display from './display.js';

if (localStorage.length <= 0) {
  const exampleTask = new Item(
    'example Task!',
    "(you can't remove this task...)",
    Date.now(),
    2
  );
  const exampleCategory = new Category('Default', { exampleTask });
  Display.render(exampleCategory);
} else {
  Display.render(JSON.parse(localStorage[localStorage.key(0)]));
}

//Copy this design? https://lakeebs.github.io/taskr/
