import { Display } from '../../node_modules/rot-js/lib/index';
import { Player } from '../beings/Player';

export class Status {
  static displayXOffset = 1;

  private display: Display;

  public constructor(display: Display) {
    this.display = display;
  }

  public refresh(player: Player) {
    this.display.clear();

    this.display.drawText(
      Status.displayXOffset,
      1,
      'Health: ' + player.getHealthPoint()
    );

    this.display.drawText(
      Status.displayXOffset,
      3,
      this.getSpottedStatus(player)
    );
  }

  private getSpottedStatus(player: Player): string {
    if (player.isSpotted()) {
      return '%c{' + '#e66' + '}' + player.getNominative() + ' are spotted!';
    }

    return '';
  }
}
