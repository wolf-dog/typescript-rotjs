import { Display } from '../../node_modules/rot-js/lib/index';
import { Coordinates } from '../map/Coordinates';
import { Level } from '../map/Level';
import { Colors } from '../static/Colors';
import { Messages } from '../ui/Messages';

export abstract class Being {
  protected mainDisplay: Display;
  protected messages: Messages;
  protected level: Level;

  protected healthPoint: number = 3;

  protected coordinates: Coordinates;
  protected visible: boolean = false;

  public constructor(
    coordinates: Coordinates,
    mainDisplay: Display,
    messages: Messages,
    level: Level
  ) {
    this.mainDisplay = mainDisplay;
    this.messages = messages;
    this.level = level;

    this.coordinates = coordinates;
  }

  public getCoordinates(): Coordinates {
    return this.coordinates;
  }

  public place(coordinates: Coordinates): void {
    this.coordinates = coordinates;
  }

  public exists(coordinates: Coordinates): boolean {
    return this.coordinates.same(coordinates);
  }

  public isVisible(): boolean {
    return this.visible;
  }

  public envisible(): void {
    this.visible = true;
  }

  public invisible(): void {
    this.visible = false;
  }

  public draw(): void {
    this.mainDisplay.draw(
      this.coordinates.x,
      this.coordinates.y,
      this.getCharacter(),
      this.getForeground(),
      this.getBackground()
    );
  }

  public isAlive(): boolean {
    return this.healthPoint > 0;
  }

  public abstract hurt(): void;

  public abstract getNominative(): string;

  public abstract getPossessive(): string;

  public abstract getObjective(): string;

  protected getCharacter(): string {
    return '';
  }

  protected getForeground(): string {
    return Colors.defaultForeGround;
  }

  protected getBackground(): string {
    return Colors.defaultBackGround;
  }
}
