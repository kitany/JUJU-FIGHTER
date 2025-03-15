class Play extends Phaser.Scene {
  constructor() {
    super('playScene')
  }

  init() {
  }

  create() {
    // game over flags
    this.gameOver = false
    this.win = false
    this.overtime = false
    
    // this.sound.stopAll()
    this.bgimg = this.add.tileSprite(0,0, 800, 600, 'bgimg').setOrigin(0, 0)
    this.bgimg.setScale(1.8)

    // initialize hero and enemy
    this.hero = new Hero(this, 150, 340, 'hero_sheet', 0)
    this.enemy = new Enemy(this, 650, 320, 'enemy_sheet', 0)
    this.physics.add.collider(this.hero, this.enemy, (hero, enemy) => {
      if (hero.isAttacking) {
        enemy.decreaseHealth(this, 5) // hero attacks, decrease enemy health
      } else if (enemy.isAttacking) {
        hero.decreaseHealth(this, 2) // enemy attacks, decrease hero health
      }
    })

    // text objects
    // this.vs = this.add.bitmapText(centerX, 54, 'fantasy_white_200', 'VS', 100).setOrigin(0.5).setTint(0xdf7dff)
    // this.vs.setDepth(5)

    this.playAgain = this.add.bitmapText(centerX, centerY + 80, 'fantasy_white', '[SPACE] TO PLAY AGAIN', 50).setOrigin(0.5)
      this.tweens.addCounter({
        from: 0,
        to: 1,
        duration: 1500,
        yoyo: true,
        onUpdate: (tween) => {
            const v = tween.getValue()
            this.playAgain.setFontSize(50 + v * 5)
        },
        repeat: -1,
      });
    this.playAgain.visible = false

    // game timer
    this.clock = new Clock(this, centerX, 50)
    this.clock.start()

    // begin randomized enemy attacks 
    this.enemyAttack()

    // keys definition
    cursors = this.input.keyboard.createCursorKeys()
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)

    // ability cooldowns
    this.abilityQ = new Ability(this, 30, 440, keyQ, 'Q', HERO_ABILITY_CD.Q, 'basic')
    this.abilityW = new Ability(this, 160, 440, keyW, 'W', HERO_ABILITY_CD.W, 'heavy')
    this.abilityE = new Ultimate(this, 300, 440, keyE, 'E', HERO_ABILITY_CD.E, 'ult')
  }

  enemyAttack() {
    this.attackTimer = this.time.addEvent({
      delay: Phaser.Math.Between(500, 4000),
      callback: () => {
        this.enemy.randomAttack(this)
        this.attackTimer.delay = Phaser.Math.Between(500, 4000)
      },
      callbackScope: this,
      loop: true,
    })
  }

  update() {
    // update character states
    this.heroFSM.step()
    this.enemyFSM.step()

    this.hero.updateCooldowns(this.game.loop.delta)

    // update ability cooldowns
    this.abilityQ.update()
    this.abilityW.update()
    this.abilityE.update()

    this.clock.update()

    if (this.clock.currentTime <= 0) {
      this.gameOver = true
      this.overtime = true
    }

    if (this.enemy.isDead || this.hero.isDead) {
      this.gameOver = true
      this.win = this.enemy.isDead ? true : false
    }

    if (this.gameOver) {
      this.clock.stop()

      this.abilityQ.reset()
      this.abilityW.reset()
      this.abilityE.reset()

      this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.Q)
      this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.W)
      this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.E)

      if (this.win) {
        this.add.bitmapText(centerX, centerY, 'fantasy_WIN', 'WIN', 200).setOrigin(0.5)
      } else if (this.overtime) {
        this.add.bitmapText(centerX, centerY, 'fantasy_WIN', 'TIE', 200).setOrigin(0.5)
      }
      else {
        this.add.bitmapText(centerX - 25, centerY, 'fantasy_WIN', 'DEFEAT', 200).setOrigin(0.5).setTint(0xFF0000)
      }
      this.playAgain.visible = true
      this.physics.pause()
      this.attackTimer.remove()

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