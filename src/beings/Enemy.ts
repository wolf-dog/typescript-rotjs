import { Display, FOV, Path, RNG } from '../../node_modules/rot-js/lib/index';
import { Coordinates } from '../map/Coordinates';
import { Level } from '../map/Level';
import { Messages } from '../ui/Messages';
import { Actor } from './Actor';
import { Being } from './Being';
import { Player } from './Player';

export abstract class Enemy extends Actor {
  protected player: Player;

  protected lastPlayerPosition: Coordinates|null = null;
  protected spotting: boolean = false;

  public constructor(
    coordinates: Coordinates,
    mainDisplay: Display,
    messages: Messages,
    level: Level,
    player: Player
  ) {
    super(coordinates, mainDisplay, messages, level);

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
      return this.level.isTerrainPassable(new Coordinates(x, y));
    };
    const fov = new FOV.PreciseShadowcasting(lightPassesCallback);

    let isSpottingPlayer = false;

    const visibilityCallback = (x: number, y: number, r: number, visibility: number) => {
      if (this.player.exists(new Coordinates(x, y))) {
        isSpottingPlayer = true;
      }
    };
    fov.compute(this.coordinates.x, this.coordinates.y, this.fovRadius, visibilityCallback);

    this.spotting = isSpottingPlayer;
    return isSpottingPlayer;
  }

  protected chasePlayer(): void {
    this.memorizePlayersPosition();
    const path = this.getPath(this.player.getCoordinates());

    if (path.length <= 1) {
      this.attack();
    } else {
      this.move(path[0]);
    }
  }

  protected trackPlayersLastPosition(): void {
    if (this.lastPlayerPosition === null) {
      this.wander();
      return;
    }

    const path = this.getPath(this.lastPlayerPosition);
    if (path.length === 0) {
      this.lastPlayerPosition = null;
      this.wander();
    } else {
      this.move(path[0]);
    }
  }

  protected memorizePlayersPosition(): void {
    this.lastPlayerPosition = this.player.getCoordinates();
  }

  protected wander(): void {
    const candidates = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const move = new Coordinates(x, y);
        const to = this.coordinates.add(move);
        if (this.level.isTerrainPassable(to)) {
          candidates.push(to);
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

    this.move(dest[0]);
  }

  protected getPath(to: Coordinates): Coordinates[] {
    const passableCallback = (x: number, y: number) => {
      return this.level.isTerrainPassable(new Coordinates(x, y));
    };
    const astar = new Path.AStar(to.x, to.y, passableCallback);

    const path: Coordinates[] = [];
    const pathCallback = function(x: number, y: number) {
      path.push(new Coordinates(x, y));
    }

    astar.compute(this.coordinates.x, this.coordinates.y, pathCallback);

    path.shift();
    return path;
  }

  protected move(to: Coordinates): void {
    const toSwap = this.level.getEnemy(to);
    if (toSwap !== null) {
      this.swap(toSwap, to);
      return;
    }

    const terrain = this.level.getTerrain(this.coordinates);
    this.mainDisplay.draw(
      this.coordinates.x,
      this.coordinates.y,
      terrain.getCharacter(),
      terrain.getForeground(),
      terrain.getBackground()
    );
    this.coordinates = to;
    this.draw();
  }

  protected abstract attack(): void;

  protected swap(toSwap: Being, to: Coordinates): void {
    toSwap.place(this.coordinates);
    toSwap.draw();

    this.coordinates = to;
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
