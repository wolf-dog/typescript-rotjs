import { Display } from '../../node_modules/rot-js/lib/index';
import { Rules } from '../static/Rules';

export class Status {
  static displayXOffset = 1;

  private display: Display;

  private messages: string[] = [];

  public constructor(display: Display) {
    this.display = display;
  }
}
