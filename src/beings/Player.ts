import { DIRS, Display } from '../../node_modules/rot-js/lib/index.js';
import { Level } from '../Level';
import { Actor } from './Actor';

export class Player extends Actor {
  static keyCodeInspect = 32;
  static keyCodeWait = 190;
  static movingKeyMap = {
    72: DIRS[8][6],
    74: DIRS[8][4],
    75: DIRS[8][0],
    76: DIRS[8][2],
    89: DIRS[8][7],
    85: DIRS[8][1],
    78: DIRS[8][5],
    77: DIRS[8][3],
  };

  private window: any;

  private spotted: boolean = false;

  public constructor(x: number, y: number, window: any, display: Display, level: Level) {
    super(x, y, display, level);

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

    if (code in Player.movingKeyMap) {
      this.move(code);
    }
  }

  private checkBox(): void {
    if (this.level.getTerrain(this.x, this.y).constructor.name !== 'Box') {
      this.window.alert('There is no box here!');
      return;
    }

    if (this.level.hasAnanas(this.x, this.y)) {
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
    let move: number[];
    switch (code) {
      case 72:
        move = DIRS[8][6];
        break;
      case 74:
        move = DIRS[8][4];
        break;
      case 75:
        move = DIRS[8][0];
        break;
      case 76:
        move = DIRS[8][2];
        break;
      case 89:
        move = DIRS[8][7];
        break;
      case 85:
        move = DIRS[8][1];
        break;
      case 78:
        move = DIRS[8][5];
        break;
      case 77:
        move = DIRS[8][3];
        break;
      default:
        return;
    }

    const toX = this.x + move[0];
    const toY = this.y + move[1];
    if (!this.level.isTerrainPassable(toX, toY)) {
      return;
    }

    if (this.level.getEnemy(toX, toY)) {
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
    this.resolve();
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
