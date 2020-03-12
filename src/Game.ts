import { Display, Engine, Map, RNG, Scheduler } from '../node_modules/rot-js/lib/index';
import { Actor } from './beings/Actor';
import { Enemy } from './beings/Enemy';
import { Hound } from './beings/Hound';
import { Pedro } from './beings/Pedro';
import { Player } from './beings/Player';
import { Coordinates } from './map/Coordinates';
import { Level } from './map/Level';
import { Colors } from './static/Colors';
import { Rules } from './static/Rules';
import { Messages } from './ui/Messages';
import { Status } from './ui/Status';

export class Game {
  private window: any;
  private level: Level;
  private mainDisplay: Display;
  private status: Status;
  private messages: Messages;
  private engine: Engine;

  public constructor(mainContainer: any, statusContainer: any, messagesContainer: any, window: any) {
    RNG.setSeed(Math.random());

    this.window = window;

    this.mainDisplay = this.initMainDisplay(mainContainer);
    this.status = this.initStatus(statusContainer);
    this.messages = this.initMessages(messagesContainer);
    this.level = this.generateLevel();

    const player = this.initPlayer(this.window, this.mainDisplay, this.messages, this.level);
    this.level.setPlayer(player);
    const enemies = this.initEnemies(
      this.window,
      this.mainDisplay,
      this.messages,
      this.level,
      player
    );
    this.level.setEnemies(enemies);

    this.drawWholeLevel(this.mainDisplay, this.level, player, enemies);

    this.engine = this.initEngine(player, enemies);

    this.welcome(this.messages);
  }

  private generateLevel(): Level {
    const level = new Level;
    const digger = new Map.Digger(Rules.levelWidth, Rules.levelHeight, {
      roomWidth: [Rules.roomWidthMin, Rules.roomWidthMax],
      roomHeight: [Rules.roomHeightMin, Rules.roomHeightMax],
      dugPercentage: Rules.dugPercentage,
    });

    digger.create((x: number, y: number, contents: number) => {
      const coordinates = new Coordinates(x, y);
      if (contents === 1) {
        level.setWall(coordinates);
        return;
      }

      level.setFloor(coordinates);
      level.pushIntoFreeCells(coordinates);
    });

    this.generateBoxes(level);

    return level;
  }

  private generateBoxes(level: Level): void {
    for (let i = 0; i < Rules.numOfBoxes; i++) {
      const index = Math.floor(RNG.getUniform() * level.getFreeCells().length);
      const coordinates = level.spliceFreeCells(index)
      level.setBox(coordinates);

      if (i === 0) {
        level.setAnanas(coordinates);
      }
    }
  }

  private initMainDisplay(container: any): Display {
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

  private initMessages(container: any): Messages {
    const display = new Display({
      bg: Colors.messagesDefaultBackGround,
      fg: Colors.messagesDefaultForeGround,
      width: Rules.messagesDisplayWidth,
      height: Rules.messagesDisplayHeight,
      fontSize: Rules.fontSize
    });
    container.appendChild(display.getContainer());

    return new Messages(display);
  }

  private initStatus(container: any): Status {
    const display = new Display({
      bg: Colors.statusDefaultBackGround,
      fg: Colors.statusDefaultForeGround,
      width: Rules.statusDisplayWidth,
      height: Rules.statusDisplayHeight,
      fontSize: Rules.fontSize
    });
    container.appendChild(display.getContainer());

    return new Status(display);
  }

  private drawWholeLevel(
    mainDisplay: Display,
    level: Level,
    player: Player,
    enemies: Enemy[]
  ): void {
    for (let x = 0; x < Rules.levelWidth; x++) {
      for (let y = 0; y < Rules.levelHeight; y++) {
        const coordinates = new Coordinates(x, y);
        const terrain = level.getTerrain(coordinates);
        mainDisplay.draw(
          coordinates.x,
          coordinates.y,
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

  private initPlayer(
    window: any,
    mainDisplay: Display,
    messages: Messages,
    level: Level
  ): Player {
    const coordinates = this.getRandomFreeCell(level);
    return new Player(coordinates, window, mainDisplay, messages, level);
  }

  private initEnemies(
    window: any,
    mainDisplay: Display,
    messages: Messages,
    level: Level,
    player: Player
  ): Enemy[] {
    const enemies = [];

    let coordinates = this.getRandomFreeCell(level);
    enemies.push(
      new Hound(
        coordinates,
        window,
        mainDisplay,
        messages,
        level,
        player
      )
    );

    coordinates = this.getRandomFreeCell(level);
    enemies.push(
      new Hound(
        coordinates,
        window,
        mainDisplay,
        messages,
        level,
        player
      )
    );

    coordinates = this.getRandomFreeCell(level);
    enemies.push(
      new Hound(
        coordinates,
        window,
        mainDisplay,
        messages,
        level,
        player
      )
    );

    coordinates = this.getRandomFreeCell(level);
    enemies.push(
      new Pedro(
        coordinates,
        window,
        mainDisplay,
        messages,
        level,
        player
      )
    );

    return enemies;
  }

  private getRandomFreeCell(level: Level): Coordinates {
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

  private welcome(messages: Messages) {
    messages.push('Welcome, adventurer!');
  };
}
