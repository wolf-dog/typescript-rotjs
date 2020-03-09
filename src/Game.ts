import { Display, Map, RNG } from '../node_modules/rot-js/lib/index';
import { Colors } from './static/Colors';
import { Rules } from './static/Rules';
import { Level } from './Level';

export class Game {
  private window: any;
  private level: Level;
  private display: Display;

  public constructor(container: any, window: any) {
    RNG.setSeed(Math.random());

    this.window = window;

    this.display = this.initDisplay(container);
    this.level = this.generateLevel();

    this.drawWholeLevel(this.display, this.level);
  }

  private generateLevel(): Level {
    const level = new Level;
    const digger = new Map.Digger(Rules.levelWidth, Rules.levelHeight, {
      roomWidth: [Rules.roomWidthMin, Rules.roomWidthMax],
      roomHeight: [Rules.roomHeightMin, Rules.roomHeightMax],
      dugPercentage: Rules.dugPercentage,
    });

    digger.create((x: number, y: number, contents: number) => {
      if (contents === 1) {
        level.setWall(x, y);
        return;
      }

      level.setFloor(x, y);
      level.pushIntoFreeCells(x, y);
    });

    return level;
  }

  private initDisplay(container: any): Display {
    const display = new Display({
      bg: Colors.defaultBackGround,
      fg: Colors.defaultForeGround,
      width: Rules.levelWidth,
      height: Rules.levelHeight,
      fontSize: Rules.fontSize
    });
    container.appendChild(display.getContainer());

    return display;
  }

  private drawWholeLevel(display: Display, level: Level): void {
    for (let x = 0; x < Rules.levelWidth; x++) {
      for (let y = 0; y < Rules.levelHeight; y++) {
        const terrain = level.getTerrain(x, y);
        display.draw(
          x,
          y,
          terrain.getCharacter(),
          terrain.getForeground(),
          terrain.getBackground()
        );
      }
    }
  }
}
