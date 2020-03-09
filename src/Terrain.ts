import { Colors } from './static/Colors';

class Terrain {
  public getCharacter(): string {
    return '';
  }

  public getForeground(): string {
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
