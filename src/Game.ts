import { Display, Engine, Map, RNG, Scheduler } from '../node_modules/rot-js/lib/index';
import { Actor } from './beings/Actor';
import { Enemy } from './beings/Enemy';
import { Hound } from './beings/Hound';
import { Pedro } from './beings/Pedro';
import { Player } from './beings/Player';
import { Colors } from './static/Colors';
import { Rules } from './static/Rules';
import { Coordinate } from './Coordinate';
import { Level } from './Level';

export class Game {
  private window: any;
  private level: Level;
  private display: Display;
  private engine: Engine;

  public constructor(container: any, window: any) {
    RNG.setSeed(Math.random());

    this.window = window;

    this.display = this.initDisplay(container);
    this.level = this.generateLevel();

    const player = this.initPlayer(this.window, this.display, this.level);
    this.level.setPlayer(player);
    const enemies = this.initEnemies(this.window, this.display, this.level, player);
    this.level.setEnemies(enemies);

    this.drawWholeLevel(this.display, this.level, player, enemies);

    this.engine = this.initEngine(player, enemies);
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

    this.generateBoxes(level);

    return level;
  }

  private generateBoxes(level: Level): void {
    for (let i = 0; i < Rules.numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
      const coordinates = level.spliceFreeCells(index)
      level.setBox(coordinates.x, coordinates.y);

      if (i === 0) {
        level.setAnanas(coordinates.x, coordinates.y);
      }
    }
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

  private drawWholeLevel(display: Display, level: Level, player: Player, enemies: Enemy[]): void {
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

    player.draw();
    for (const enemy of enemies) {
      enemy.draw();
    }
  }

  private initPlayer(window: any, display: Display, level: Level): Player {
    const coordinates = this.getRandomFreeCell(level);
    return new Player(coordinates.x, coordinates.y, window, display, level);
  }

  private initEnemies(window: any, display: Display, level: Level, player: Player): Enemy[] {
    const enemies = [];

    let coordinates = this.getRandomFreeCell(level);
    enemies.push(new Hound(coordinates.x, coordinates.y, window, display, level, player));

    coordinates = this.getRandomFreeCell(level);
    enemies.push(new Hound(coordinates.x, coordinates.y, window, display, level, player));

    coordinates = this.getRandomFreeCell(level);
    enemies.push(new Hound(coordinates.x, coordinates.y, window, display, level, player));

    coordinates = this.getRandomFreeCell(level);
    enemies.push(new Pedro(coordinates.x, coordinates.y, window, display, level, player));

    return enemies;
  }

  private getRandomFreeCell(level: Level): Coordinate {
    const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
    return level.spliceFreeCells(index);
  }

  private initEngine(player: Player, enemies: Enemy[]): Engine {
    const scheduler = new Scheduler.Simple();

    scheduler.add(player, true);
    for (const enemy of enemies) {
      scheduler.add(enemy, true);
    }

    const engine = new Engine(scheduler);
    player.setEngine(engine);
    for (const enemy of enemies) {
      enemy.setEngine(engine);
    }

    engine.start();

    return engine;
  }
}
