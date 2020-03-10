import { Engine } from '../../node_modules/rot-js/lib/index';
import { Being } from './Being';

export abstract class Actor extends Being {
  protected engine: Engine|null = null;

  protected fovRadius: number = 10;

  public abstract act(): void;

  public setEngine(engine: Engine): void {
    this.engine = engine;
  }
}
