/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Dom.js
// Экспортируем класс DOM
class DOM {
  constructor(classContainer, svgCollection) {
    this.container = document.querySelector(`.${classContainer}`); // Контейнер с секциями
    this.svgCollection = svgCollection; // Объект с объектами изображений svg
    this.arrStandatrtSect = ['To do', 'In progress', 'Done']; // Массив стандарнтых секций
  }

  // Метод инициализации DOM
  init() {
    // Создаем и добавляем стандартные секции в контейнер
    this.arrStandatrtSect.forEach(title => {
      const section = this.createSection(title);
      this.container.append(section);
    });

    // Инициализируем слушатели событий
    this.initListener();
  }

  /*
  * Метод инициализации изначальных слушателей
  */
  initListener() {
    // Получаем и добавляем слушатели для кнопок добавления задач в футере каждой секции
    const footerBntAdd = Array.from(document.querySelectorAll('.task-section__footer-button_add'));
    footerBntAdd.forEach(addButton => {
      this.addListener(addButton, 'click', this.footerBntHandler);
    });

    // Получаем и добавляем слушатели для input-элементов в футере каждой секции
    const inputImg = Array.from(document.querySelectorAll('.task-section__footer-input'));
    inputImg.forEach(input => {
      this.addListener(input, 'change', this.inputImgHandler);
    });

    // Создаем кнопку добавления новой секции и добавляем ей слушатель события
    const addSectionButton = this.createAddSectionButton();
    this.addListener(addSectionButton, 'click', this.addSectionButtonHandler);
  }

  /* ----------- Методы работы с LocalStorage -------*/
  /*
  * Метод формирования объекта секции с задачами для
  * дальнейшего сохранения в LocalStorage
  */
  createObj(section) {
    this.name = 'createObj';
    // Получаем все задачи в текущей секции
    const tasks = Array.from(section.querySelectorAll('.task'));

    // Создаем массив объектов для каждой задачи
    const tasksArr = tasks.map(task => {
      const obj = {};
      obj.className = task.classList.value;
      obj.content = task.querySelector('.task-text').textContent;
      return obj;
    });

    // Формируем объект секции
    const obj = {
      classSect: section.classList.value,
      titleSect: section.querySelector('.task-section__title').textContent,
      tasksArr
    };
    return obj;
  }

  /*
  * Метод получения массива объектов секции для сохранения
  * в localStorage
  */
  getData() {
    // Получаем все секции на странице
    const sections = Array.from(document.querySelectorAll('.task-section'));

    // Создаем массив объектов для каждой секции
    const arrSection = sections.map(section => {
      const obj = this.createObj(section);
      return obj;
    });
    return arrSection;
  }

  /*
  * Метод отображения информации, хранящейся в локальном хранилище
  */
  displayData(arrData) {
    // Проходим по массиву объектов и создаем секции с задачами
    arrData.forEach(sectionObj => {
      const section = this.createSection(sectionObj.titleSect, sectionObj.classSect);
      const taskList = section.querySelector('.task-list');
      sectionObj.tasksArr.forEach(task => {
        const li = this.createTask(task.content, task.className);
        taskList.append(li);
      });
      this.container.append(section);
    });
  }

  /* ----------- Методы связанные с созданием элементов -------*/
  /*
  * Метод создания элемента
  */
  createEl(typeEl, classEl = null, content = null) {
    this.name = 'createEl';
    const el = document.createElement(typeEl);
    if (classEl) {
      el.className = classEl;
    }
    if (content) {
      el.textContent = content;
    }
    return el;
  }

  /*
  * Метод создания блока с полем ввода новой задачи
  * или имени новой секции
  */
  createTextarea(buttonName) {
    const block = this.createEl('div', 'textarea-block');
    const textarea = this.createEl('textarea', 'textarea');
    textarea.placeholder = 'Enter a title for this card...';
    const buttonBlock = this.createEl('div', 'textarea__button-block');
    const addButton = this.createEl('button', 'textarea__button_add', buttonName);
    const closeButton = this.createEl('button', 'textarea__button_close');
    const iconClose = this.createSVG(this.svgCollection.close, 'textarea-icon_close');
    closeButton.innerHTML += iconClose;
    buttonBlock.append(addButton);
    buttonBlock.append(closeButton);
    block.append(textarea);
    block.append(buttonBlock);
    return block;
  }

  /*
  * Метод создания карточки задачи
  */
  createTask(content, className = 'task') {
    const li = this.createEl('li', className);
    const taskContentBlock = this.createEl('div', 'task__content');
    const taskText = this.createEl('p', 'task-text', content);
    const button = this.createEl('button', 'task__button_close hidden', 'x');
    taskContentBlock.append(taskText);
    li.append(taskContentBlock);
    li.append(button);
    this.addListener(li, 'mouseover', this.taskMouseoverHandler);
    this.addListener(li, 'mouseout', this.taskMouseoutHandler);
    this.addListener(button, 'click', this.taskBtnCloseHandler);
    return li;
  }

  /*
  * Метод создания секции задач
  */
  createSection(title, className = 'task-section') {
    const section = this.createEl('section', className);
    const header = this.createSectionHeader(title);
    const footer = this.createSectionFooter();
    const container = this.createEl('div', 'task-section__container');
    const taskList = this.createEl('ul', 'task-list');
    container.append(taskList);
    section.append(header);
    section.append(container);
    section.append(footer);
    return section;
  }

  /*
  * Метод создания шапки секции
  */
  createSectionHeader(name) {
    const header = this.createEl('header', 'task-section__header');
    const title = this.createEl('h2', 'task-section__title', name);
    const button = this.createEl('button', 'task-section__button');
    const svg = this.createSVG(this.svgCollection.menu, 'task-section__icon_menu');
    button.innerHTML += svg;
    header.append(title);
    header.append(button);
    return header;
  }

  /*
  * Метод создания подвала секции
  */
  createSectionFooter() {
    const footer = this.createEl('footer', 'task-section__footer');
    const footerBlock = this.createEl('div', 'task-section__footer-block');
    const button = this.createEl('button', 'task-section__footer-button_add', '+ Add new task');
    const label = this.createEl('label', 'task-section__footer-label');
    const input = this.createEl('input', 'task-section__footer-input');
    input.type = 'file';
    input.accept = 'image/*';
    const svg = this.createSVG(this.svgCollection.loadImg, 'task-section__footer-icon');
    label.innerHTML += svg;
    label.append(input);
    footerBlock.append(button);
    footerBlock.append(label);
    footer.append(footerBlock);
    return footer;
  }

  /*
  * Метод создания блока с картинкой
  */
  createImageBlock(files) {
    const imageBlock = this.createEl('div', 'image-block hidden');
    const image = this.createEl('img', 'image-block__image');
    image.src = URL.createObjectURL(files[0]);
    imageBlock.append(image);
    return imageBlock;
  }

  /*
  * Метод создания кнопки добавления новой секции
  */
  createAddSectionButton() {
    const button = this.createEl('button', 'add-section-button', 'Add new Section');
    this.container.append(button);
    return button;
  }

  /*
  * Метод создания кода SVG-изображения для вставки на страницу
  * !Использовать с innerHTML
  */
  createSVG(svgObject, className) {
    this.name = 'createSVG';
    // Объявляем массив со строками path и итоговую строку path
    const pathSTrArr = [];
    let path = '';

    // Формируем массив кода строк path
    svgObject.path.forEach(item => {
      const pathN = `<path d='${item}'/>`;
      pathSTrArr.push(pathN);
    });

    // Формируем итоговую строку path
    pathSTrArr.forEach(item => {
      path += item;
    });

    // Собираем код svg-картинки
    const svg = `<svg class='${svgObject.className} ${className}' xmlns='${svgObject.xmlns}' viewBox='${svgObject.viewBox}'>${path}</svg>`;
    return svg;
  }

  /* ------- Методы связанные обработчиками событий -----*/
  /*
  * Метод добавления обработчика события на элемент
  */
  addListener(el, typeEvent, func, additional = null) {
    el.addEventListener(typeEvent, event => {
      event.preventDefault();
      const bindFunc = func.bind(this);
      if (additional) {
        bindFunc(event, additional);
      } else {
        bindFunc(event);
      }
    });
  }

  /*
  * Метод обработки клика по кнопке добавления новой задачи
  * в подвале секции. При клике появляется поле для ввода
  * текста задачи
  */
  footerBntHandler(event) {
    const textareaBlock = this.createTextarea('Add task');
    const footer = event.target.closest('.task-section__footer');
    const footerBtnBlock = footer.querySelector('.task-section__footer-block');
    footerBtnBlock.classList.add('hidden');
    footer.append(textareaBlock);
    const textareaBtnAdd = textareaBlock.querySelector('.textarea__button_add');
    const textareaBtnClose = textareaBlock.querySelector('.textarea__button_close');
    this.addListener(textareaBtnAdd, 'click', this.textareaBtnAddHandler);
    this.addListener(textareaBtnClose, 'click', this.textareaBtnCloseHandler);
  }

  /*
  * Метод обработки клика по кнопке добавления новой
  * задачи в секцию
  */
  textareaBtnAddHandler(event) {
    const textareaBlock = event.target.closest('.textarea-block');
    const textarea = textareaBlock.querySelector('.textarea');
    const taskList = textareaBlock.closest('.task-section').querySelector('.task-list');
    const footerBtnBlock = textareaBlock.closest('.task-section__footer').querySelector('.task-section__footer-block');
    const ImgBlock = textareaBlock.closest('.task-section__footer').querySelector('.image-block');
    if (ImgBlock !== null && textarea.value.length > 0) {
      const task = this.createTask(textarea.value);
      task.prepend(ImgBlock);
      taskList.append(task);
      footerBtnBlock.classList.remove('hidden');
      textareaBlock.remove();
    } else if (textarea.value.length > 0) {
      const task = this.createTask(textarea.value);
      taskList.append(task);
      footerBtnBlock.classList.remove('hidden');
      textareaBlock.remove();
    } else {
      textarea.placeholder = 'Task cannot be empty!';
    }
  }

  /*
  * Метод обработки клика по кнопке закрытия блока
  * с полем для ввода новой задачи
  */
  textareaBtnCloseHandler(event) {
    this.name = 'textareaBtnCloseHandler';
    const textareaBlock = event.target.closest('.textarea-block');
    const footerBtnBlock = textareaBlock.closest('.task-section__footer').querySelector('.task-section__footer-block');
    footerBtnBlock.classList.remove('hidden');
    textareaBlock.remove();
  }

  /*
  * Метод обработки клика по кнопке удаления задачи
  */
  taskBtnCloseHandler(event) {
    this.name = 'taskBtnCloseHandler';
    event.target.closest('.task').remove();
  }

  /*
  * Метод обработки события mouseover на задаче
  * При произшествии события делаем видимой кнопку удаления задачи
  */
  taskMouseoverHandler(event) {
    this.name = 'taskMouseoverHandler';
    event.target.closest('.task').querySelector('.task__button_close').classList.remove('hidden');
  }

  /*
  * Метод обработки события mouseout на задаче
  * При произшествии события скрываем кнопку удаления задачи
  */
  taskMouseoutHandler(event) {
    this.name = 'taskMouseoutHandler';
    event.target.closest('.task').querySelector('.task__button_close').classList.add('hidden');
  }

  /*
  * Метод обработки клика по элементу input в подвале страницы
  */
  inputImgHandler(event) {
    const footer = event.target.closest('.task-section__footer');
    const files = Array.from(event.currentTarget.files);
    const imageBlock = this.createImageBlock(files);
    footer.prepend(imageBlock);
    const image = imageBlock.querySelector('.image-block__image');
    image.addEventListener('load', evt => {
      const imageBlockN = evt.target.closest('.image-block');
      imageBlockN.classList.remove('hidden');
      this.footerBntHandler(evt);
    });
  }

  /*
  * Метод обработки клика по кнопке добавления новой секции
  */
  addSectionButtonHandler(event) {
    const button = event.target;
    const div = this.createEl('div', 'add-section-block');
    const textareaBlock = this.createTextarea('Add section');
    div.append(textareaBlock);
    this.container.append(div);
    button.classList.add('hidden');
    const addButton = textareaBlock.querySelector('.textarea__button_add');
    const textarea = textareaBlock.querySelector('.textarea');
    addButton.addEventListener('click', () => {
      this.container.append(this.createSection(textarea.value));
      this.container.append(button);
      button.classList.remove('hidden');
      div.remove();
    });
  }
}
;// CONCATENATED MODULE: ./src/js/svgCollection.js
const svgCollection = {
  check: {
    className: 'check',
    viewBox: '0 0 459 459',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M124.95,181.05l-35.7,35.7L204,331.5l255-255l-35.7-35.7L204,260.1L124.95,181.05z M408,408H51V51h255V0H51 C22.95,0,0,22.95,0,51v357c0,28.05,22.95,51,51,51h357c28.05,0,51-22.95,51-51V204h-51V408z']
  },
  clip: {
    className: 'clip',
    viewBox: '0 0 792 792',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M306,150.48v459.36c0,0-6.696,96.408,91.476,96.408C486,706.248,486,609.84,486,609.84V126.72C486,126.72,486,0,360,0 S234,126.72,234,126.72v483.12c0,0,0,182.16,162,182.16s162-182.16,162-182.16V126.72c0-19.8-36-19.8-36,0v483.12 c0,0,13.104,146.16-126,146.16c-126,0-126-146.16-126-146.16V126.72c0,0,0-90.72,90-90.72s90,90.72,90,90.72v483.12 c0,0,0,56.809-52.524,56.809c-52.523,0-55.476-56.809-55.476-56.809V150.48C342,130.68,306,130.68,306,150.48z']
  },
  comment: {
    className: 'comment',
    viewBox: '0 0 128 128',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M113,0H15A15,15,0,0,0,0,15V79.57a15,15,0,0,0,15,15H38.28a1,1,0,0,1,1,1V121a7,7,0,0,0,11.95,4.95L82.31,94.87a1,1,0,0,1,.71-.29h30a15,15,0,0,0,15-15V15A15,15,0,0,0,113,0Zm9,79.57a9,9,0,0,1-9,9H83a7,7,0,0,0-4.95,2L47,121.7a1,1,0,0,1-1.71-.71V95.57a7,7,0,0,0-7-7H15a9,9,0,0,1-9-9V15a9,9,0,0,1,9-9h98a9,9,0,0,1,9,9Z']
  },
  loadImg: {
    className: 'addImg',
    viewBox: '0 0 64 64',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M60,2H4A2.002,2.002,0,0,0,2,4V60a2.002,2.002,0,0,0,2,2H60a2.002,2.002,0,0,0,2-2V4A2.002,2.002,0,0,0,60,2Zm0,1.9985V41.98L45.6333,30.2261a1.0026,1.0026,0,0,0-1.1616-.0752L33.4766,36.9961,17.7466,19.335a.9992.9992,0,0,0-1.3936-.0977L4,29.72V4ZM4,60V32.343L16.9023,21.394,32.5435,38.9551a1,1,0,0,0,1.2749.1841l11.1025-6.9121L60,44.5638V60Z', 'M47,27A10,10,0,1,0,37,17,10.0111,10.0111,0,0,0,47,27ZM47,9a8,8,0,1,1-8,8A8.0092,8.0092,0,0,1,47,9Z']
  },
  like: {
    className: 'like',
    viewBox: '0 0 128 128',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M116.22,16.68C108,8.8,95.16,4.88,83.44,6.71,75,8,68.17,12.26,64.07,18.68c-4-6.53-10.62-10.84-18.93-12.22-11.61-1.91-25,2.19-33.37,10.21A38.19,38.19,0,0,0,0,44.05,39.61,39.61,0,0,0,11.74,72.65L59,119.94a7,7,0,0,0,9.94,0l47.29-47.3A39.61,39.61,0,0,0,128,44.05,38.19,38.19,0,0,0,116.22,16.68ZM112,68.4,64.73,115.7a1,1,0,0,1-1.46,0L16,68.4A33.66,33.66,0,0,1,6,44.11,32.23,32.23,0,0,1,15.94,21c5.89-5.67,14.78-9,23.29-9a30.38,30.38,0,0,1,4.94.4c5,.82,11.67,3.32,15.42,10.56A5.06,5.06,0,0,0,64,25.68h0a4.92,4.92,0,0,0,4.34-2.58h0c3.89-7.2,10.82-9.66,15.94-10.46,9.77-1.52,20.9,1.84,27.7,8.37A32.23,32.23,0,0,1,122,44.11,33.66,33.66,0,0,1,112,68.4Z']
  },
  menu: {
    className: 'menu',
    viewBox: '0 0 32 32',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M13,16c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,14.346,13,16z', 'M13,26c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,24.346,13,26z', 'M13,6c0,1.654,1.346,3,3,3s3-1.346,3-3s-1.346-3-3-3S13,4.346,13,6z']
  },
  more: {
    className: 'more',
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M3.5,7 C3.22385763,7 3,6.77614237 3,6.5 C3,6.22385763 3.22385763,6 3.5,6 L20.5,6 C20.7761424,6 21,6.22385763 21,6.5 C21,6.77614237 20.7761424,7 20.5,7 L3.5,7 Z M3.5,12 C3.22385763,12 3,11.7761424 3,11.5 C3,11.2238576 3.22385763,11 3.5,11 L20.5,11 C20.7761424,11 21,11.2238576 21,11.5 C21,11.7761424 20.7761424,12 20.5,12 L3.5,12 Z M3.5,17 C3.22385763,17 3,16.7761424 3,16.5 C3,16.2238576 3.22385763,16 3.5,16 L20.5,16 C20.7761424,16 21,16.2238576 21,16.5 C21,16.7761424 20.7761424,17 20.5,17 L3.5,17 Z']
  },
  close: {
    className: 'close',
    viewBox: '0 0 512 512',
    xmlns: 'http://www.w3.org/2000/svg',
    path: ['M268.064,256.75l138.593-138.593c3.124-3.124,3.124-8.189,0-11.313c-3.125-3.124-8.189-3.124-11.314,0L256.75,245.436   L118.157,106.843c-3.124-3.124-8.189-3.124-11.313,0c-3.125,3.124-3.125,8.189,0,11.313L245.436,256.75L106.843,395.343   c-3.125,3.125-3.125,8.189,0,11.314c1.562,1.562,3.609,2.343,5.657,2.343s4.095-0.781,5.657-2.343L256.75,268.064l138.593,138.593   c1.563,1.562,3.609,2.343,5.657,2.343s4.095-0.781,5.657-2.343c3.124-3.125,3.124-8.189,0-11.314L268.064,256.75z']
  }
};
/* harmony default export */ const js_svgCollection = (svgCollection);
;// CONCATENATED MODULE: ./src/js/Storage.js
class Storage {
  constructor(storage = localStorage) {
    this.storage = storage;
  }
  addData(data, name) {
    this.storage.setItem(name, JSON.stringify(data));
    console.log(JSON.parse(this.storage.getItem(name)));
  }
  getData(name) {
    try {
      console.log(JSON.parse(this.storage.getItem(name)));
      return JSON.parse(this.storage.getItem(name));
    } catch (error) {
      return error;
    }
  }
}
;// CONCATENATED MODULE: ./src/js/DnD.js
// Экспортируем класс DnD
class DnD {
  constructor() {
    this.draggEl = null; // Исходный элемент для перетаскивания
    this.cloneEl = null; // Клон исходного элемента
    this.container = null; // Контейнер, в котором секции
    this.shiftX = null; // Позиция нажатия по Х
    this.shiftY = null; // Позиция нажатия по Y
    this.bellowEl = null; // Элемент под указателем мыши
    this.emptyLi = null; // Пустой пункт списка для выделения места для переноса
  }

  // Метод инициализации Drag-and-Drop
  init() {
    this.container = document.querySelector('.main');

    // Назначаем обработчики событий
    this.container.addEventListener('mousedown', this.mouseDownHandler);
    this.container.addEventListener('mousemove', this.mouseMoveHandler);
    this.container.addEventListener('mouseup', this.mouseUpHandler);
    this.container.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  // Обработчик события нажатия кнопки мыши
  mouseDownHandler(event) {
    if (!event.target.classList.contains('task-text') || !event.target.closest('.task__content')) {
      console.log('contains task: ', !event.target.classList.contains('task-text'), 'parents contains task: ', !event.target.closest('.task__content')); // дебугер
      return;
    }
    event.preventDefault();

    // Инициализация начальных параметров для перетаскивания
    this.draggEl = event.target.closest('.task');
    this.cloneEl = this.draggEl.cloneNode(true);
    this.shiftX = event.clientX - this.draggEl.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.draggEl.getBoundingClientRect().top;
    this.cloneEl.style.width = `${this.draggEl.offsetWidth}px`;
    this.cloneEl.classList.add('dragged');

    // Добавляем клон элемента в DOM
    document.querySelector('.main').appendChild(this.cloneEl);
    this.cloneEl.style.left = `${event.pageX - this.shiftX}px`;
    this.cloneEl.style.top = `${event.pageY - this.shiftY}px`;
    this.draggEl.style.opacity = 0;
    console.log('drag'); // дебугер

    // Создаем пустой элемент списка для выделения места
    this.emptyLi = document.createElement('li');
    this.emptyLi.classList.add('empty');
    this.emptyLi.style.height = `${this.draggEl.offsetHeight}px`;
  }

  // Обработчик события перемещения мыши
  mouseMoveHandler(event) {
    event.preventDefault();
    if (!this.draggEl) {
      return;
    }
    this.cloneEl.classList.add('hidden');
    this.bellowEl = document.elementFromPoint(event.clientX, event.clientY);
    this.cloneEl.classList.remove('hidden');
    this.cloneEl.style.left = `${event.pageX - this.shiftX}px`;
    this.cloneEl.style.top = `${event.pageY - this.shiftY}px`;

    // Определение места для вставки элемента
    if (this.bellowEl.closest('.task-section')) {
      const parent = this.bellowEl.closest('.task-section').querySelector('.task-list');
      if (!parent.hasChildNodes()) {
        parent.append(this.emptyLi);
      } else if (this.bellowEl.closest('.task')) {
        parent.insertBefore(this.emptyLi, this.bellowEl.closest('.task'));
      }
    }
  }

  // Обработчик события отпускания кнопки мыши
  mouseUpHandler(event) {
    event.preventDefault();
    if (!this.draggEl) {
      return;
    }

    // Если не над секцией, удаляем клон и пустой элемент
    if (!this.bellowEl.closest('.task-section')) {
      document.querySelector('.task-section').removeChild(this.cloneEl);
      document.querySelector('.empty').remove();
      this.draggEl.style.opacity = 100;
      this.cloneEl = null;
      this.draggEl = null;
      return;
    }
    const parentUl = this.bellowEl.closest('.task-section').querySelector('.task-list');

    // Определение места для вставки элемента
    if (this.bellowEl.closest('task-section__header')) {
      parentUl.prepend(this.draggEl);
    } else if (this.bellowEl.closest('.task-section__footer')) {
      parentUl.append(this.draggEl);
    } else {
      parentUl.insertBefore(this.draggEl, this.bellowEl.closest('.task'));
    }

    // Удаляем пустой элемент
    if (document.querySelector('.empty')) {
      document.querySelector('.empty').remove();
    }

    // Удаляем клон
    this.cloneEl.remove();
    this.draggEl.style.opacity = 100;
    this.draggEl = null;
    this.cloneEl = null;
  }

  // Обработчик события покидания области контейнера
  mouseLeaveHandler(event) {
    event.preventDefault();
    if (!this.draggEl) {
      return;
    }

    // Удаляем клон и пустой элемент
    document.querySelector('.main').removeChild(this.cloneEl);
    document.querySelector('.empty').remove();
    this.draggEl.style.opacity = 100;
    this.cloneEl = null;
    this.draggEl = null;
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
// Импортируем необходимые модули
 // Модуль для работы с DOM
 // Модуль с коллекцией SVG-изображений
 // Модуль для работы с хранилищем
 // Модуль для реализации функционала Drag-and-Drop

// Создаем экземпляр класса DOM для взаимодействия с DOM-элементами
const dom = new DOM('main', js_svgCollection);
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
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;