import { DIRS, Display } from '../../node_modules/rot-js/lib/index.js';
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
      this.window.alert('There is no box here!');
      return;
    }

    if (this.level.hasAnanas(this.coordinates)) {
      this.window.alert('You Found an ananas and won this game!!');
      this.window.removeEventListener('keydown', this);
    } else {
      this.window.alert('This box is empty.');
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
    return;
  }

  private resolve(): void {
    this.window.removeEventListener('keydown', this);
    if (this.engine) {
      this.engine.unlock();
    }
  }

  protected getCharacter(): string {
    return '@';
  }
}
