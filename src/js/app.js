// Импортируем необходимые модули
import DOM from './Dom'; // Модуль для работы с DOM
import svgCollection from './svgCollection'; // Модуль с коллекцией SVG-изображений
import Storage from './Storage'; // Модуль для работы с хранилищем
import DnD from './DnD'; // Модуль для реализации функционала Drag-and-Drop

// Создаем экземпляр класса DOM для взаимодействия с DOM-элементами
const dom = new DOM('main', svgCollection);
// Создаем экземпляр класса Storage для работы с локальным хранилищем
const storage = new Storage(localStorage);
// Создаем экземпляр класса DnD для реализации функционала Drag-and-Drop
const dnd = new DnD();

// Инициализируем функционал Drag-and-Drop
dnd.init();

// Проверяем наличие данных в локальном хранилище
if (localStorage.content) {
  // Если данные есть, отображаем их на странице
  dom.displayData(storage.getData('content'));
  // Инициализируем обработчики событий для работы с отображенными данными
  dom.initListener();
} else {
  // Если данных нет, инициализируем страницу
  dom.init();
}

// Добавляем обработчик события выгрузки страницы для сохранения данных в хранилище
window.addEventListener('unload', () => {
  storage.addData(dom.getData(), 'content');
});
