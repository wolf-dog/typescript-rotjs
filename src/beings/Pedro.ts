import { Enemy } from './Enemy';

export class Pedro extends Enemy {
  protected isSpottingPlayer() {
    if (this.player.isSpotted()) {
      this.spotting = true;
      return true;
    } else {
      return super.isSpottingPlayer();
    }
  }

  protected attack(): void {
    this.messages.push(`${this.getNominative()} captures ${this.player.getObjective()}!`);

    this.player.gameOver();
  }

  protected getCharacter(): string {
    return 'P';
  }

  public getNominative(): string {
    return 'Pedro';
  }

  public getPossessive(): string {
    return "Pedro's";
  }

  public getObjective(): string {
    return 'Pedro';
  }
}
