class CoordinateHandler {
  constructor(array = []) {
    this.array = array;
  }

  printGraph() {
    console.log('그래프...');
  }

  getDistance(coord1, coord2) {
    return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2);
  }
}

export { CoordinateHandler };
