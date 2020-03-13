import { Game } from './system/Game';

document.body.onload = () => {
  new Game(
    document.getElementById('app-main'),
    document.getElementById('app-status'),
    document.getElementById('app-messages'),
    window
  )
}
