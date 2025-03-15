/**
 * ----- ASSETS USED ----------------------------------------------------
 * AUDIO:
 *  blip_01 - freesound.org/people/AceOfSpadesProduc100/sounds/341024/
 *  blip_02 - freesound.org/people/Tissman/sounds/443907/
 *  flame - freesound.org/people/ReincarnatedEchoes/sounds/680696/
 *  punch - freesound.org/people/FALL-E/sounds/712550
 *  fight - freesound.org/people/exe2be/sounds/553600/
 * BGM:
 *  encounter - freesound.org/people/joshuaempyre/sounds/251461/
 * 
 */

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
  scene: [ Menu, Encounter, Play, Credits],
}

const game = new Phaser.Game(config)

// globals
const centerX = game.config.width / 2
const centerY = game.config.height / 2

const HERO_HEALTH_X = 30 
const ENEMY_HEALTH_X = centerX + 80
const HEALTH_Y = 30

let cursors, keyQ, keyW, keyE, keySKIP, keyCREDITS
let restart = false

const HERO_ABILITY_CD = {
  Q: 3000,
  W: 5500,
  E: 10000,
}