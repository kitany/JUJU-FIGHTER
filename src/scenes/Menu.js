class Menu extends Phaser.Scene {
  constructor() {
    super('menuScene')
  }

  init() {
  }

  preload() {
    // load assets
    this.load.path = "./assets/"

    // load JSON
    this.load.json('dialog', 'json/dialog.json')

    // load audio
    this.load.audio('blip01', 'audio/blip01.wav')
    this.load.audio('blip02', 'audio/blip02.wav')
    this.load.audio('encounter_bgm', 'audio/encounter.wav')
    this.load.audio('fight', 'audio/fight.mp3')
    this.load.audio('punch', 'audio/punch.mp3')
    this.load.audio('flame', 'audio/flame.wav')

    // load images
    this.load.image('dialogbox', 'img/dialogbox.png')
    this.load.image('hero', 'img/hero/kyo_kusanagi.png')
    this.load.spritesheet('hero_sheet', 'img/hero/kyo_sheet.png', {
      frameWidth: 900,
      frameHeight: 600,
    })

    this.load.image('enemy', 'img/enemy/leona.png')
    this.load.spritesheet('enemy_sheet', 'img/enemy/leona_sheet.png', {
      frameWidth: 675,
      frameHeight: 600,
    })

    this.load.image('bgimg', 'img/desert_background.PNG')
    this.load.image('basic', 'img/basic.png')
    this.load.image('heavy', 'img/heavy.png')
    this.load.image('ult', 'img/ult.png')

    // load bitmap font
    this.load.bitmapFont('fantasy_white', 'fonts/fantasy_white.png', 'fonts/fantasy_white.xml')
    this.load.bitmapFont('fantasy_black', 'fonts/fantasy_battles_black.png', 'fonts/fantasy_battles_black.xml')
    this.load.bitmapFont('fantasy_white_200', 'fonts/fantasy_white_200.png', 'fonts/fantasy_white_200.xml')
    this.load.bitmapFont('fantasy_WIN', 'fonts/fantasy_WIN.png', 'fonts/fantasy_WIN.xml')
    this.load.bitmapFont('chocolates_black', 'fonts/chocolates_black.png', 'fonts/chocolates_black.xml')
    this.load.bitmapFont('chocolates_white', 'fonts/chocolates_white.png', 'fonts/chocolates_white.xml')
  }

  create() {
    this.add.bitmapText(centerX - 140, centerY - 64, 'fantasy_WIN', 'JUJU', 200).setOrigin(0.5)
    this.add.bitmapText(centerX, centerY + 40, 'fantasy_WIN', 'FIGHTER', 160).setOrigin(0.5)

    this.playText = this.add.bitmapText(centerX, centerY + 120, 'fantasy_white', 'PRESS [SPACE] TO PLAY', 50).setOrigin(0.5)
    this.creditText = this.add.bitmapText(centerX, centerY + 160, 'fantasy_white', '[C] FOR CREDITS', 50).setOrigin(0.5)

    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 2000,
      yoyo: true,
      onUpdate: (tween) => {
          const v = tween.getValue();
          this.playText.setFontSize(50 + v * 5);
      },
      repeat: -1,
    });

    // keys definition
    cursors = this.input.keyboard.createCursorKeys()
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    keyCREDITS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)

    if (!restart) {
      // animations: hero
      this.anims.create({
        key: 'hero_idle',
        frameRate: 4,
        repeat: -1,
        frames: this.anims.generateFrameNumbers('hero_sheet', { start: 0, end: 0 }),
      })
      this.anims.create({
        key: 'hero_basic',
        frameRate: 4,
        repeat: 0,
        frames: this.anims.generateFrameNumbers('hero_sheet', { start: 1, end: 1 }),
      })
      this.anims.create({
        key: 'hero_heavy',
        frameRate: 4,
        repeat: 0,
        frames: this.anims.generateFrameNumbers('hero_sheet', { start: 3, end: 3 }),
      })
      this.anims.create({
        key: 'hero_ult',
        frameRate: 4,
        repeat: 0,
        frames: this.anims.generateFrameNumbers('hero_sheet', { start: 2, end: 2 }),
      })

      // animations: enemy
      this.anims.create({
        key: 'enemy_idle',
        frameRate: 4,
        repeat: -1,
        frames: this.anims.generateFrameNumbers('enemy_sheet', { start: 0, end: 0 }),
      })
      this.anims.create({
        key: 'enemy_basic',
        frameRate: 4,
        repeat: 0,
        frames: this.anims.generateFrameNumbers('enemy_sheet', { start: 1, end: 1 }),
      })
      this.anims.create({
        key: 'enemy_heavy',
        frameRate: 4,
        repeat: 0,
        frames: this.anims.generateFrameNumbers('enemy_sheet', { start: 2, end: 2 }),
      })
      this.anims.create({
        key: 'enemy_ult',
        frameRate: 4,
        repeat: 0,
        frames: this.anims.generateFrameNumbers('enemy_sheet', { start: 3, end: 3 }),
      })
    }
  }

  update() {
    // this.scene.start('playScene')
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.sound.play('blip01', {volume: 1.0})
      this.time.delayedCall(500, () => {
        this.scene.start('encounterScene')
      });
    }
    if (Phaser.Input.Keyboard.JustDown(keyCREDITS)) {
      this.sound.play('blip01', {volume: 1.0})
      this.time.delayedCall(500, () => {
        this.scene.start('creditsScene')
      });
    }
  }
}
