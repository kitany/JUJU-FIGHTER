class Play extends Phaser.Scene {
  constructor() {
    super('playScene')
  }

  init() {
  }

  create() {
    // this.sound.stopAll()
    this.bgimg = this.add.tileSprite(0,0, 800, 600, 'bgimg').setOrigin(0, 0)
    this.bgimg.setScale(1.8)

    // initialize hero and enemy
    this.hero = new Hero(this, 150, 340, 'hero_sheet', 0)
    this.enemy = new Enemy(this, 650, 320, 'enemy_sheet', 0)
    this.physics.add.collider(this.hero, this.enemy, (hero, enemy) => {
      enemy.decreaseHealth(this, 10)
    })

    // keys definition
    cursors = this.input.keyboard.createCursorKeys()
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  }

  update() {
    this.heroFSM.step()
    this.enemyFSM.step()
  }
}