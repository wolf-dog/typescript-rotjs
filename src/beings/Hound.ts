import { Coordinates } from '../map/Coordinates';
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
        this.messages.push(`${this.getNominative()} barks at you!`);
      }
    }

    return spotting;
  }

  protected attack(): void {
      this.messages.push(`${this.getNominative()} watches you.`);
    return;
  }

  protected swap(toSwap: Being, to: Coordinates): void {
    return;
  }

  protected getCharacter(): string {
    return 'H';
  }

  public getNominative(): string {
    return 'Hound';
  }

  public getPossessive(): string {
    return "Hound's";
  }

  public getObjective(): string {
    return 'Hound';
  }
}
