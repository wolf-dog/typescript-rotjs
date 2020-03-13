import { Player } from '../beings/Player';

export class Event {
  private window: any;

  public constructor(window: any) {
    this.window = window;
  }

  public addListener(event: string, player: Player): void {
    this.window.addEventListener(event, player);
  }

  public removeListener(event: string, player: Player): void {
    this.window.removeEventListener(event, player);
  }
}
