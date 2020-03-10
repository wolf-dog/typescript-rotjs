import { Terrain, Floor, Box, Wall, Void } from './Terrain';
import { Enemy } from './beings/Enemy';
import { Player } from './beings/Player';
import { Coordinates } from './Coordinates';

export class Level {
  private terrain: { [key: string]: Terrain } = {};
  private freeCells: string[] = [];

  private ananas: string|null = null;

  private player: Player|null = null;
  private enemies: Enemy[] = [];

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

  public hasAnanas(x: number, y: number): boolean {
    return Level.key(x, y) === this.ananas;
  }

  public setAnanas(x: number, y: number): void {
    this.ananas = Level.key(x, y);
  }

  public getFreeCells(): string[] {
    return this.freeCells;
  }

  public spliceFreeCells(index: number): Coordinates {
    return Level.partKey(this.freeCells.splice(index, 1)[0]);
  }

  public pushIntoFreeCells(x: number, y: number): void {
    this.freeCells.push(Level.key(x, y));
  }

  public getPlayer(): Player|null {
    return this.player;
  }

  public setPlayer(player: Player): void {
    this.player = player;
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public setEnemies(enemies: Enemy[]): void {
    this.enemies = enemies;
  }

  public getEnemy(x: number, y: number): Enemy|null {
    for (const enemy of this.enemies) {
      if (enemy.exists(x, y)) {
        return enemy;
      }
    }

    return null;
  }

  private static key(x: number, y: number): string {
    return `${x},${y}`;
  }

  private static partKey(key: string): Coordinates {
    const parts = key.split(',');
    return new Coordinates(
      parseInt(parts[0]),
      parseInt(parts[1])
    )
  }
}
