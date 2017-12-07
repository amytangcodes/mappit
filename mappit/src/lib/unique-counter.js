class UniqueCounter {
  constructor() {
    this.items = {};
  }

  add(item) {
    this.items[item] = 1;
  }

  count() {
    return Object.keys(this.items).length;
  }
}

export default UniqueCounter;
