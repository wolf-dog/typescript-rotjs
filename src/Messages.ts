import { Display } from '../node_modules/rot-js/lib/index';
import { Colors } from './static/Colors';
import { Rules } from './static/Rules';

export class Messages {
  static displayXOffset = 1;

  private display: Display;

  private messages: string[] = [];

  public constructor(display: Display) {
    this.display = display;
  }

  public push(message: string): void {
    this.messages.unshift(message);
    this.refresh();
  }

  private refresh(): void {
    this.display.clear();
    const numOfMessages = Math.floor(Rules.messagesDisplayHeight / 2);

    for (let i = 0; i < numOfMessages; i++) {
      this.draw(i);
    }
  }

  private draw(index: number): void {
    if (!(index in this.messages)) {
      return;
    }

    let color: string;
    if (index in Colors.messagesDecayedForeGround) {
      color = Colors.messagesDecayedForeGround[index];
    } else {
      color = Colors.messagesDefaultForeGround;
    }

    this.display.drawText(
      Messages.displayXOffset,
      Rules.messagesDisplayHeight - 1 - (index * 2),
      '%c{' + color + '}' + this.messages[index]
    );
  }
}
