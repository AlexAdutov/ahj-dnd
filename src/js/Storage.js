export default class Storage {
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
