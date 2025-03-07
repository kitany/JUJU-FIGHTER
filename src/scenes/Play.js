class Play extends Phaser.Scene {
  constructor() {
    super('playScene')
  }

  init() {
    this.HERO_HEALTH_X = 30
    this.ENEMY_HEALTH_X = centerX + 30
    this.HEALTH_Y = 30
    
    this.HEALTH_WIDTH = 340
    this.HEALTH_HEIGHT = 35
  }

  create() {
    // this.sound.stopAll()
    this.bgimg = this.add.tileSprite(0,0, 800, 600, 'bgimg').setOrigin(0, 0)
    this.bgimg.setScale(1.8)

    this.hero = new Hero(this, 150, 340, 'hero_sheet', 0)
    this.enemy = new Enemy(this, 650, 320, 'enemy_sheet', 0)

    this.createHealthBar(this.hero, this.HERO_HEALTH_X, this.HEALTH_Y, this.HEALTH_WIDTH, this.HEALTH_HEIGHT, 0x00ff00); // green
    this.createHealthBar(this.enemy, this.ENEMY_HEALTH_X, this.HEALTH_Y, this.HEALTH_WIDTH, this.HEALTH_HEIGHT, 0xff0000); // red

    // keys definition
    cursors = this.input.keyboard.createCursorKeys()
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  }

  update() {
    this.updateHealthBar(this.hero, this.hero.healthBar)
    this.updateHealthBar(this.enemy, this.enemy.healthBar)

    this.heroFSM.step()
  }

  createHealthBar(character, x, y, width, height, color) {

    character.healthBar = this.add.graphics()
    character.healthBar.fillStyle(color, 1)
    character.healthBar.fillRect(x, y, width, height)

    character.health = 100
    character.maxHealth = 100
    character.healthBar.width = width * (character.health / character.maxHealth)
  }

  updateHealthBar(character, healthBar) {
    healthBar.clear()

    let barWidth = this.HEALTH_WIDTH * (character.health / character.maxHealth)
    healthBar.fillStyle(0x00ff00, 1)
    healthBar.fillRect(this.HERO_HEALTH_X, this.HEALTH_Y, barWidth, this.HEALTH_HEIGHT)

    if (character === this.enemy) {
      healthBar.fillStyle(0xff0000, 1)
      healthBar.fillRect(this.ENEMY_HEALTH_X, this.HEALTH_Y, barWidth, this.HEALTH_HEIGHT)
    }
  }
}