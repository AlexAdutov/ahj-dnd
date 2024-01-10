export default class DnD {
  constructor() {
    this.draggEl = null; // Исходный элемент для перетаскивания
    this.cloneEl = null; // Клон исходного элемента
    this.container = null; // Контейнер, в котором секции
    this.shiftX = null; // Позиция нажатия по Х
    this.shiftY = null; // Позиция нажатия по Y
    this.bellowEl = null; // Элемент под указателем мыши
    this.emptyLi = null; // Пустой пункт списка для выделения места для переноса
  }

  init() {
    this.container = document.querySelector('.main');

    this.container.addEventListener('mousedown', this.mouseDownHandler);
    this.container.addEventListener('mousemove', this.mouseMoveHandler);
    this.container.addEventListener('mouseup', this.mouseUpHandler);
    this.container.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  mouseDownHandler(event) {
    if (!event.target.classList.contains('task') || !event.target.closest('.task')) {
      return;
    }

    event.preventDefault();

    this.draggEl = event.target.closest('.task');
    this.cloneEl = this.draggEl.cloneNode(true);

    this.shiftX = event.clientX - this.draggEl.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.draggEl.getBoundingClientRect().top;

    this.cloneEl.style.width = `${this.draggEl.offsetWidth}px`;

    this.cloneEl.classList.add('dragged');

    document.querySelector('.main').appendChild(this.cloneEl);

    this.cloneEl.style.left = `${event.pageX - this.shiftX}px`;
    this.cloneEl.style.top = `${event.pageY - this.shiftY}px`;
    this.draggEl.style.opacity = 0;

    this.emptyLi = document.createElement('li');
    this.emptyLi.classList.add('empty');
    this.emptyLi.style.height = `${this.draggEl.offsetHeight}px`;
  }

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

    if (this.bellowEl.closest('.task-section')) {
      const parent = this.bellowEl.closest('.task-section').querySelector('.task-list');

      if (!parent.hasChildNodes()) {
        parent.append(this.emptyLi);
      } else if (this.bellowEl.closest('.task')) {
        parent.insertBefore(this.emptyLi, this.bellowEl.closest('.task'));
      }
    }
  }

  mouseUpHandler(event) {
    event.preventDefault();

    if (!this.draggEl) {
      return;
    }

    if (!this.bellowEl.closest('.task-section')) {
      document.querySelector('.task-section').removeChild(this.cloneEl);
      document.querySelector('.empty').remove();
      this.draggEl.style.opacity = 100;
      this.cloneEl = null;
      this.draggEl = null;
      return;
    }

    const parentUl = this.bellowEl.closest('.task-section').querySelector('.task-list');

    if (this.bellowEl.closest('task-section__header')) {
      parentUl.prepend(this.draggEl);
    } else if (this.bellowEl.closest('.task-section__footer')) {
      parentUl.append(this.draggEl);
    } else {
      parentUl.insertBefore(this.draggEl, this.bellowEl.closest('.task'));
    }

    if (document.querySelector('.empty')) {
      document.querySelector('.empty').remove();
    }

    this.cloneEl.remove();
    this.draggEl.style.opacity = 100;
    this.draggEl = null;
    this.cloneEl = null;
  }

  mouseLeaveHandler(event) {
    event.preventDefault();
    if (!this.draggEl) {
      return;
    }

    document.querySelector('.main').removeChild(this.cloneEl);
    document.querySelector('.empty').remove();
    this.draggEl.style.opacity = 100;
    this.cloneEl = null;
    this.draggEl = null;
  }
}
