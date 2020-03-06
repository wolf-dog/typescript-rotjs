import { Display, Map, RNG } from '../node_modules/rot-js/lib/index';
import { Colors } from './static/Colors';
import { Rules } from './static/Rules';
import { Level } from './Level';

export class Game {
  window = null;
  level = null;
  display = null;

  constructor(container, window) {
    RNG.setSeed(Math.random());

    this.window = window;

    this.level = this._generateLevel();
    this.display = this._initDisplay(container);

    this._drawWholeLevel(this.display, this.level);
  }

  _generateLevel() {
    const level = new Level;
    const digger = new Map.Digger(Rules.levelWidth, Rules.levelHeight, {
      roomWidth: [Rules.roomWidthMin, Rules.roomWidthMax],
      roomHeight: [Rules.roomHeightMin, Rules.roomHeightMax],
      dugPercentage: Rules.dugPercentage,
    });

    digger.create((x, y, contents) => {
      if (contents === 1) {
        level.setWall(x, y);
        return;
      }

      level.setFloor(x, y);
      level.pushIntoFreeCells(x, y);
    });

    return level;
  }

  _initDisplay(container) {
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

  _drawWholeLevel(display, level) {
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
