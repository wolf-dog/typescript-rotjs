import { Display } from '../../node_modules/rot-js/lib/index';
import { Colors } from '../static/Colors';
import { Level } from '../Level';
import { Messages } from '../Messages';

export abstract class Being {
  protected mainDisplay: Display;
  protected messages: Messages;
  protected level: Level;

  public x: number;
  public y: number;

  public constructor(
    x: number,
    y: number,
    mainDisplay: Display,
    messages: Messages,
    level: Level
  ) {
    this.mainDisplay = mainDisplay;
    this.messages = messages;
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
    this.mainDisplay.draw(
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
