class Play extends Phaser.Scene {
  constructor() {
    super('playScene')
  }

  init() {
  }

  create() {
    // game over flag
    this.gameOver = false
    
    // this.sound.stopAll()
    this.bgimg = this.add.tileSprite(0,0, 800, 600, 'bgimg').setOrigin(0, 0)
    this.bgimg.setScale(1.8)

    // initialize hero and enemy
    this.hero = new Hero(this, 150, 340, 'hero_sheet', 0)
    this.enemy = new Enemy(this, 650, 320, 'enemy_sheet', 0)
    this.physics.add.collider(this.hero, this.enemy, (hero, enemy) => {
      enemy.decreaseHealth(this, 10)
    })

    this.playAgain = this.add.bitmapText(centerX, centerY + 80, 'fantasy_italic', '[SPACE] TO PLAY AGAIN', 50).setOrigin(0.5)
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1500,
        yoyo: true,
        onUpdate: (tween) => {
            const v = tween.getValue();
            this.playAgain.setFontSize(50 + v * 5);
        },
        repeat: -1,
      });
    this.playAgain.visible = false

    // keys definition
    cursors = this.input.keyboard.createCursorKeys()
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
  }

  update() {
    this.heroFSM.step()
    this.enemyFSM.step()

    if (this.enemy.isDead) {
      this.gameOver = true
    }

    if (this.gameOver) {
      this.add.bitmapText(centerX, centerY, 'fantasy_italic', 'WIN', 200).setOrigin(0.5)
      this.playAgain.visible = true
      this.physics.pause()

      if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
        this.sound.play('blip01', {volume: 1.0})
        this.time.delayedCall(1000, () => {
          // this.sound.play('blip_01', {volume: 1.0})
          this.sound.stopAll()
          this.scene.start('encounterScene')
        });
      }
    }
  }
}