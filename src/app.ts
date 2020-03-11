import { Game } from './Game';

document.body.onload = () => {
  new Game(
    document.getElementById('app-main'),
    document.getElementById('app-messages'),
    window
  )
}
