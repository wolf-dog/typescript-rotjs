import { DIRS, Display, FOV } from '../../node_modules/rot-js/lib/index.js';
import { Coordinates } from '../map/Coordinates';
import { Level } from '../map/Level';
import { Status } from '../ui/Status';
import { Messages } from '../ui/Messages';
import { Actor } from './Actor';
import { Enemy } from './Enemy';

export class Player extends Actor {
  static keyCodeInspect = 32;
  static keyCodeWait = 190;

  private window: any;
  private status: Status;

  private spotted: boolean = false;

  public constructor(
    coordinates: Coordinates,
    window: any,
    mainDisplay: Display,
    status: Status,
    messages: Messages,
    level: Level
  ) {
    super(coordinates, mainDisplay, messages, level);

    this.window = window;
    this.status = status;
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

  public hurt(): void {
    this.healthPoint--;

    if (!this.isAlive()) {
      this.messages.push(`${this.getNominative()} are dead...`);
      this.gameOver();
    }
  }

  public gameOver(): void {
    this.lock();
    this.messages.push('Game Over!!!');
  }

  public refresh(): void {
    this.drawFov();
    this.refreshStatus();
  }

  public act(): void {
    this.unspot();

    this.lock();
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

  public getNominative(): string {
    return 'You';
  }

  public getPossessive(): string {
    return 'Your';
  }

  public getObjective(): string {
    return 'You';
  }

  protected getCharacter(): string {
    return '@';
  }

  private drawFov(): void {
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

  private refreshStatus(): void {
    this.status.refresh(this);
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
    this.refresh();
    this.window.removeEventListener('keydown', this);
    this.unlock();
  }
}
