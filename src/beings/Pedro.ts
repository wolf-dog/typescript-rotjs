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

    if (this.engine) {
      this.engine.lock();
    }
    this.messages.push('Game Over!!!');
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
