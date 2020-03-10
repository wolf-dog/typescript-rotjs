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
    if (this.engine) {
      this.engine.lock();
    }
    this.window.alert('Game Over!!!');
  }

  protected getCharacter(): string {
    return 'P';
  }
}
