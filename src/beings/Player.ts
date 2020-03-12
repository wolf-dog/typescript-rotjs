import { DIRS, Display, FOV } from '../../node_modules/rot-js/lib/index.js';
import { Coordinates } from '../map/Coordinates';
import { Level } from '../map/Level';
import { Messages } from '../ui/Messages';
import { Actor } from './Actor';
import { Enemy } from './Enemy';

export class Player extends Actor {
  static keyCodeInspect = 32;
  static keyCodeWait = 190;

  private window: any;

  private spotted: boolean = false;

  public constructor(
    coordinates: Coordinates,
    window: any,
    mainDisplay: Display,
    messages: Messages,
    level: Level
  ) {
    super(coordinates, mainDisplay, messages, level);

    this.window = window;
  }

  public isSpotted(): boolean {
    return this.spotted;
  }

  public spot(): void {
    this.spotted = true;
  }

  public unspot(): void {
    this.spotted = false;
  }

  public drawFov(): void {
    const lightPassesCallback = (x: number, y: number) => {
      return this.level.isTerrainPassable(new Coordinates(x, y));
    };
    const fov = new FOV.PreciseShadowcasting(lightPassesCallback);

    for (let enemy of this.level.getEnemies()) {
      enemy.invisible();
    }
    this.level.resetTerrainVisibility();

    const visibilityCallback = (x: number, y: number, r: number, visibility: number) => {
      const target = new Coordinates(x, y);
      this.level.getTerrain(target).envisible()

      for (let enemy of this.level.getEnemies()) {
        if (enemy.exists(target)) {
          enemy.envisible();
        }
      }
    };
    fov.compute(this.coordinates.x, this.coordinates.y, this.fovRadius, visibilityCallback);

    this.level.draw(this.mainDisplay);
  }

  public act(): void {
    this.unspot();

    if (this.engine) {
      this.engine.lock();
    }
    this.window.addEventListener('keydown', this);
  }

  public handleEvent(event: any): void {
    const code = event.keyCode;

    switch (code) {
      case Player.keyCodeInspect:
        this.checkBox();
        return;
      case Player.keyCodeWait:
        this.wait();
        return;
    }

    this.move(code);
  }

  private checkBox(): void {
    if (this.level.getTerrain(this.coordinates).constructor.name !== 'Box') {
      this.messages.push('There is no box here!');
      return;
    }

    if (this.level.hasAnanas(this.coordinates)) {
      this.messages.push('You Found an ananas and won this game!!');
      this.window.removeEventListener('keydown', this);
    } else {
      this.messages.push('This box is empty.');
      this.resolve();
    }
  }

  private wait(): void {
    this.resolve();
  }

  private move(code: number): void {
    let moveNumber: number[];
    switch (code) {
      case 72:
        moveNumber = DIRS[8][6];
        break;
      case 74:
        moveNumber = DIRS[8][4];
        break;
      case 75:
        moveNumber = DIRS[8][0];
        break;
      case 76:
        moveNumber = DIRS[8][2];
        break;
      case 89:
        moveNumber = DIRS[8][7];
        break;
      case 85:
        moveNumber = DIRS[8][1];
        break;
      case 78:
        moveNumber = DIRS[8][5];
        break;
      case 77:
        moveNumber = DIRS[8][3];
        break;
      default:
        return;
    }

    const move = new Coordinates(moveNumber[0], moveNumber[1]);

    const to = this.coordinates.add(move);
    if (!this.level.isTerrainPassable(to)) {
      return;
    }

    const enemy = this.level.getEnemy(to);
    if (enemy) {
      this.attack(enemy);
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
    this.resolve();
  }

  private attack(enemy: Enemy): void {
    if (!enemy.isAlive()) {
      return;
    }

    this.messages.push(`${this.getNominative()} hit ${enemy.getObjective()}.`);
    enemy.hurt();
    this.resolve();
  }

  private resolve(): void {
    this.drawFov();
    this.window.removeEventListener('keydown', this);
    if (this.engine) {
      this.engine.unlock();
    }
  }

  protected getCharacter(): string {
    return '@';
  }

  public getNominative(): string {
    return 'You';
  }

  public getPossessive(): string {
    return 'Your';
  }

  public getObjective(): string {
    return 'You';
  }
}
