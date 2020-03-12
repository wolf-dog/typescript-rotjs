export class Coordinates {
  public readonly x: number
  public readonly y: number

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public same(target: Coordinates): boolean {
    if (this.x === target.x && this.y === target.y) {
      return true;
    }
    return false;
  }

  public add(target: Coordinates): Coordinates {
    return new Coordinates(this.x + target.x, this.y + target.y);
  }
}
