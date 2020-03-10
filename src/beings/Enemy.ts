import { Display, FOV, Path, RNG } from '../../node_modules/rot-js/lib/index';
import { Coordinates } from '../Coordinates';
import { Level } from '../Level';
import { Actor } from './Actor';
import { Being } from './Being';
import { Player } from './Player';

export abstract class Enemy extends Actor {
  protected window: any;
  protected player: Player;

  protected lastPlayerPosition: Coordinates|null = null;
  protected spotting: boolean = false;

  public constructor(x: number, y: number, window: any, display: Display, level: Level, player: Player) {
    super(x, y, display, level);

    this.window = window;
    this.player = player;
  }

  public act(): void {
    if (this.isSpottingPlayer()) {
      this.chasePlayer();
    } else {
      this.trackPlayersLastPosition();
    }
  }

  protected isSpottingPlayer(): boolean {
    const lightPassesCallback = (x: number, y: number) => {
      return this.level.isTerrainPassable(x, y);
    };
    const fov = new FOV.PreciseShadowcasting(lightPassesCallback);

    let isSpottingPlayer = false;

    const visibilityCallback = (x: number, y: number, r: number, visibility: number) => {
      if (this.player.exists(x, y)) {
        isSpottingPlayer = true;
      }
    };
    fov.compute(this.x, this.y, this.fovRadius, visibilityCallback);

    this.spotting = isSpottingPlayer;
    return isSpottingPlayer;
  }

  protected chasePlayer(): void {
    this.memorizePlayersPosition();
    const path = this.getPath(this.player.x, this.player.y);

    if (path.length <= 1) {
      this.attack();
    } else {
      this.move(path[0].x, path[0].y);
    }
  }

  protected trackPlayersLastPosition(): void {
    if (this.lastPlayerPosition === null) {
      this.wander();
      return;
    }

    const path = this.getPath(this.lastPlayerPosition.x, this.lastPlayerPosition.y);
    if (path.length === 0) {
      this.lastPlayerPosition = null;
      this.wander();
    } else {
      this.move(path[0].x, path[0].y);
    }
  }

  protected memorizePlayersPosition(): void {
    this.lastPlayerPosition = new Coordinates(this.player.x, this.player.y);
  }

  protected wander(): void {
    const candidates = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const toX = this.x + x;
        const toY = this.y + y;
        if (this.level.isTerrainPassable(toX, toY)) {
          candidates.push([toX, toY]);
        }
      }
    }

    if (candidates.length === 0) {
      return;
    }

    const dest = candidates.splice(
      Math.floor(RNG.getUniform() * candidates.length),
      1
    );

    this.move(dest[0][0], dest[0][1]);
  }

  protected getPath(toX: number, toY: number): Coordinates[] {
    const passableCallback = (x: number, y: number) => {
      return this.level.isTerrainPassable(x, y);
    };
    const astar = new Path.AStar(toX, toY, passableCallback);

    const path: Coordinates[] = [];
    const pathCallback = function(x: number, y: number) {
      path.push(new Coordinates(x, y));
    }

    astar.compute(this.x, this.y, pathCallback);

    path.shift();
    return path;
  }

  protected move(toX: number, toY: number): void {
    const toSwap = this.level.getEnemy(toX, toY);
    if (toSwap !== null) {
      this.swap(toSwap, toX, toY);
      return;
    }

    const terrain = this.level.getTerrain(this.x, this.y);
    this.display.draw(
      this.x,
      this.y,
      terrain.getCharacter(),
      terrain.getForeground(),
      terrain.getBackground()
    );
    this.x = toX;
    this.y = toY;
    this.draw();
  }

  protected abstract attack(): void;

  protected swap(toSwap: Being, toX: number, toY: number): void {
    toSwap.x = this.x;
    toSwap.y = this.y;
    toSwap.draw();

    this.x = toX;
    this.y = toY;
    this.draw();
  }

  protected getForeground(): string {
    if (this.spotting) {
      return 'red';
    } else {
      return 'yellow';
    }
  }
}
