import { Display } from '../../node_modules/rot-js/lib/index';
import { Colors } from '../static/Colors';
import { Level } from '../Level';

export abstract class Being {
  protected display: Display;
  protected level: Level;

  public x: number;
  public y: number;

  public constructor(x: number, y: number, display: Display, level: Level) {
    this.display = display;
    this.level = level;

    this.x = x;
    this.y = y;
  }

  public place(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public exists(x: number, y: number): boolean {
    if (this.x === x && this.y === y) {
      return true;
    }
    return false;
  }

  public draw(): void {
    this.display.draw(
      this.x,
      this.y,
      this.getCharacter(),
      this.getForeground(),
      this.getBackground()
    );
  }

  protected getCharacter(): string {
    return '';
  }

  protected getForeground(): string {
    return Colors.defaultForeGround;
  }

  protected getBackground(): string {
    return Colors.defaultBackGround;
  }
}
