import { Display } from '../node_modules/rot-js/lib/index';
import { Rules } from './static/Rules';

export class Messages {
  private display: Display;

  private messages: string[] = [];

  public constructor(display: Display) {
    this.display = display;
  }

  public push(message: string) {
    this.messages.unshift(message);
    this.draw();
  }

  private draw() {
    this.display.clear();
    const numOfMessages = Math.floor(Rules.messagesDisplayHeight / 2);

    for (let i = 0; i < numOfMessages; i++) {
      if (i in this.messages) {
        this.display.drawText(
          1,
          Rules.messagesDisplayHeight - 1 - (i * 2),
          this.messages[i]
        );
      }
    }
  }
}
