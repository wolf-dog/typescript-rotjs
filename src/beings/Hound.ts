import { Being } from './Being';
import { Enemy } from './Enemy';

export class Hound extends Enemy {
  protected fovRadius: number = 20;

  protected isSpottingPlayer(): boolean {
    const spotting = super.isSpottingPlayer();
    if (spotting) {
      this.spotting = true;
      this.player.spot();
      this.messages.push('Hound barks at you!!');
    } else {
      this.spotting = false;
    }

    return spotting;
  }

  protected attack(): void {
      this.messages.push('Hound watches you.');
    return;
  }

  protected swap(toSwap: Being, toX: number, toY: number): void {
    return;
  }

  protected getCharacter(): string {
    return 'H';
  }
}
