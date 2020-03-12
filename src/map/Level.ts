import { Enemy } from '../beings/Enemy';
import { Player } from '../beings/Player';
import { Coordinates } from './Coordinates';
import { Terrain, Floor, Box, Wall, Void } from './Terrain';

export class Level {
  private terrain: { [key: string]: Terrain } = {};
  private freeCells: string[] = [];

  private ananas: string|null = null;

  private player: Player|null = null;
  private enemies: Enemy[] = [];

  public isTerrainPassable(coordinates: Coordinates): boolean {
    const terrain = this.getTerrain(coordinates);

    if (terrain === null) {
      return false;
    }
    return terrain.isPassable();
  }

  public getTerrain(coordinates: Coordinates): Terrain {
    const key = Level.key(coordinates);
    if (key in this.terrain) {
      return this.terrain[key];
    }

    return new Void;
  }

  public setTerrain(coordinates: Coordinates, terrain: Terrain): void {
    this.terrain[Level.key(coordinates)] = terrain;
  }

  public setFloor(coordinates: Coordinates): void {
    this.setTerrain(coordinates, new Floor());
  }

  public setBox(coordinates: Coordinates): void {
    this.setTerrain(coordinates, new Box());
  }

  public setWall(coordinates: Coordinates): void {
    this.setTerrain(coordinates, new Wall());
  }

  public hasAnanas(coordinates: Coordinates): boolean {
    return Level.key(coordinates) === this.ananas;
  }

  public setAnanas(coordinates: Coordinates): void {
    this.ananas = Level.key(coordinates);
  }

  public getFreeCells(): string[] {
    return this.freeCells;
  }

  public spliceFreeCells(index: number): Coordinates {
    return Level.partKey(this.freeCells.splice(index, 1)[0]);
  }

  public pushIntoFreeCells(coordinates: Coordinates): void {
    this.freeCells.push(Level.key(coordinates));
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

  public getEnemy(coordinates: Coordinates): Enemy|null {
    for (const enemy of this.enemies) {
      if (enemy.exists(coordinates)) {
        return enemy;
      }
    }

    return null;
  }

  private static key(coordinates: Coordinates): string {
    return `${coordinates.x},${coordinates.y}`;
  }

  private static partKey(key: string): Coordinates {
    const parts = key.split(',');
    return new Coordinates(
      parseInt(parts[0]),
      parseInt(parts[1])
    )
  }
}
