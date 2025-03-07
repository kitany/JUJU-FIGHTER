class Play extends Phaser.Scene {
  constructor() {
    super('playScene')
  }

  create() {
    this.bgimg = this.add.tileSprite(0,0, 800, 600, 'bgimg').setOrigin(0, 0)
    this.bgimg.setScale(1.8)

    let hero = new Hero(this, 150, 340, 'hero')
    let enemy = new Hero(this, 650, 330, 'enemy')
    hero.sprite.setScale(0.32)
    enemy.sprite.setScale(0.3)
    cursors = this.input.keyboard.createCursorKeys();
  }

  update() {

  }
}