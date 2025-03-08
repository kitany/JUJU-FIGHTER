let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    },
  },
  scene: [ Menu, Encounter, Play ],
}

const game = new Phaser.Game(config)

// globals
const centerX = game.config.width / 2
const centerY = game.config.height / 2

const HERO_HEALTH_X = 30
const ENEMY_HEALTH_X = centerX + 80
const HEALTH_Y = 30

let cursors, keyQ, keyW, keyE

const HERO_ABILITY_CD = {
  Q: 1000,
  W: 2000,
  E: 4000,
}