import { Terrain, Floor, Box, Wall, Void } from './Terrain';

export class Level {
  private terrain: { [key: string]: Terrain } = {};
  private freeCells: string[] = [];

  public isTerrainPassable(x: number, y: number): boolean {
    const terrain = this.getTerrain(x, y);

    if (terrain === null) {
      return false;
    }
    return terrain.isPassable();
  }

  public getTerrain(x: number, y: number): Terrain {
    const key = Level.key(x, y);
    if (key in this.terrain) {
      return this.terrain[key];
    }

    return new Void;
  }

  public setTerrain(x: number, y: number, terrain: Terrain): void {
    this.terrain[Level.key(x, y)] = terrain;
  }

  public setFloor(x: number, y: number): void {
    this.setTerrain(x, y, new Floor());
  }

  public setBox(x: number, y: number): void {
    this.setTerrain(x, y, new Box());
  }

  public setWall(x: number, y: number): void {
    this.setTerrain(x, y, new Wall());
  }

  public getFreeCells(): string[] {
    return this.freeCells;
  }

  public spliceFreeCells(index: number): { [key: string]: number } {
    return Level.partKey(this.freeCells.splice(index, 1)[0]);
  }

  public pushIntoFreeCells(x: number, y: number): void {
    this.freeCells.push(Level.key(x, y));
  }

  private static key(x: number, y: number): string {
    return `${x},${y}`;
  }

  private static partKey(key: string): { [key: string]: number } {
    const parts = key.split(',');
    return {
      x: parseInt(parts[0]),
      y: parseInt(parts[1]),
    }
  }
}
