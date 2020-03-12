import { Being } from './Being';
import { Enemy } from './Enemy';

export class Hound extends Enemy {
  protected fovRadius: number = 20;

  protected isSpottingPlayer(): boolean {
    const isAlreadySpotting = this.spotting;
    const spotting = super.isSpottingPlayer();
    if (spotting) {
      this.player.spot();
      if (!isAlreadySpotting) {
        this.messages.push('Hound barks at you!!');
      }
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
