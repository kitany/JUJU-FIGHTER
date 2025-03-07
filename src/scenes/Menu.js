class Menu extends Phaser.Scene {
  constructor() {
    super('menuScene')
  }

  init() {
  }

  preload() {
    // load assets
    this.load.path = "./assets/"

    // load JSON (ie dialog text)
    this.load.json('dialog', 'json/dialog.json')

    // load audio
    this.load.audio('blip_01', 'audio/blip_01.wav')
    this.load.audio('blip_02', 'audio/blip_02.wav')

    // load images
    this.load.image('dialogbox', 'img/dialogbox.png')
    this.load.image('hero', 'img/kyo_kusanagi.png')
    this.load.image('enemy', 'img/leona.png')
    this.load.image('bgimg', 'img/desert_background.PNG')

    // load bitmap font
    this.load.bitmapFont('fantasy_italic', 'fonts/fantasy_battles_italic.png', 'fonts/fantasy_battles_italic.xml')
    this.load.bitmapFont('fantasy_black', 'fonts/fantasy_battles_black.png', 'fonts/fantasy_battles_black.xml')
    this.load.bitmapFont('altone_bold', 'fonts/altone_bold.png', 'fonts/altone_bold.xml')
  }

  create() {
    this.add.bitmapText(centerX - 140, centerY - 64, 'fantasy_italic', 'JUJU', 200).setOrigin(0.5)
    this.add.bitmapText(centerX, centerY + 40, 'fantasy_italic', 'FIGHTER', 160).setOrigin(0.5)

    this.playText = this.add.bitmapText(centerX, centerY + 120, 'fantasy_italic', 'PRESS [SPACE] TO PLAY', 50).setOrigin(0.5)

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

    // create input
    cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.sound.play('blip_01', {volume: 1.0})
      this.time.delayedCall(1000, () => {
        // this.sound.play('blip_01', {volume: 1.0})
        this.scene.start('encounterScene')
      });
    }
    // this.scene.start('encounterScene')
  }
}
