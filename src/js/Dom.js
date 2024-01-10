export default class DOM {
  constructor(classContainer, svgCollection) {
    this.container = document.querySelector(`.${classContainer}`); // Контейнер с секциями
    this.svgCollection = svgCollection; // Объект с объектами изображений svg
    this.arrStandatrtSect = ['To do', 'In progress', 'Done']; // Массив стандарнтых секций
  }

  init() {
    this.arrStandatrtSect.forEach((title) => {
      const section = this.createSection(title);
      this.container.append(section);
    });

    this.initListener();
  }

  /*
  * Метод инициализации изначальных слушателей
  */
  initListener() {
    const footerBntAdd = Array.from(document.querySelectorAll('.task-section__footer-button_add'));
    footerBntAdd.forEach((addButton) => {
      this.addListener(addButton, 'click', this.footerBntHandler);
    });

    const inputImg = Array.from(document.querySelectorAll('.task-section__footer-input'));
    inputImg.forEach((input) => {
      this.addListener(input, 'change', this.inputImgHandler);
    });

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
    const tasks = Array.from(section.querySelectorAll('.task'));

    const tasksArr = tasks.map((task) => {
      const obj = {};
      obj.className = task.classList.value;
      obj.content = task.querySelector('.task-text').textContent;
      return obj;
    });

    const obj = {
      classSect: section.classList.value,
      titleSect: section.querySelector('.task-section__title').textContent,
      tasksArr,
    };

    return obj;
  }

  /*
  * Метод получения массива объектов секции для сохранения
  * в localStorage
  */
  getData() {
    const sections = Array.from(document.querySelectorAll('.task-section'));

    const arrSection = sections.map((section) => {
      const obj = this.createObj(section);
      return obj;
    });

    return arrSection;
  }

  /*
  * Метод отображения информации, хранящейся в локальном хранилище
  */
  displayData(arrData) {
    arrData.forEach((sectionObj) => {
      const section = this.createSection(sectionObj.titleSect, sectionObj.classSect);

      const taskList = section.querySelector('.task-list');
      sectionObj.tasksArr.forEach((task) => {
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
    svgObject.path.forEach((item) => {
      const pathN = `<path d='${item}'/>`;
      pathSTrArr.push(pathN);
    });

    // Формируем итоговую строку path
    pathSTrArr.forEach((item) => {
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
    el.addEventListener(typeEvent, (event) => {
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

    image.addEventListener('load', (evt) => {
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
