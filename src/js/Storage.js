export default class Storage {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  addData(data, name) {
    this.storage.setItem(name, JSON.stringify(data));
  }

  getData(name) {
    try {
      return JSON.parse(this.storage.getItem(name));
    } catch (error) {
      return error;
    }
  }
}
