import { Colors } from '../static/Colors';

abstract class Terrain {
  private visible: boolean = false;

  public isVisible(): boolean {
    return this.visible;
  }

  public envisible(): void {
    this.visible = true;
  }

  public invisible(): void {
    this.visible = false;
  }

  public abstract getCharacter(): string;

  public getForeground(): string {
    if (this.isVisible()) {
      return Colors.visibleForeGround;
    }

    return Colors.defaultForeGround;
  }

  public getBackground(): string {
    return Colors.defaultBackGround;
  }

  public isPassable(): boolean {
    return false;
  }
}

class Floor extends Terrain {
  public getCharacter(): string {
    return '.';
  }

  public getForeground(): string {
    if (this.isVisible()) {
      return Colors.visibleForeGround;
    }

    return '#444';
  }

  public isPassable(): boolean {
    return true;
  }
}

class Box extends Terrain {
  public getCharacter(): string {
    return '*';
  }

  public getForeground(): string {
    return 'green';
  }

  public isPassable(): boolean {
    return true;
  }
}

class Wall extends Terrain {
  public getCharacter(): string {
    return '';
  }

  public getBackground(): string {
    return 'grey';
  }
}


class Void extends Terrain {
  public getCharacter(): string {
    return '';
  }
}

export { Terrain, Floor, Box, Wall, Void }
