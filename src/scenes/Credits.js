class Credits extends Phaser.Scene {
  constructor() {
    super('creditsScene')
  }
  create() {
    this.CREDITS_TEXT = 
    `AUDIO:
    blip_01 - freesound.org/people/AceOfSpadesProduc100/sounds/341024/
    blip_02 - freesound.org/people/Tissman/sounds/443907/
    flame - freesound.org/people/ReincarnatedEchoes/sounds/680696/
    punch - freesound.org/people/FALL-E/sounds/712550
    fight - freesound.org/people/exe2be/sounds/553600/
    
BGM:
    encounter - freesound.org/people/joshuaempyre/sounds/251461/`

    this.credits = this.add.bitmapText(centerX, centerY, 'chocolates_white', this.CREDITS_TEXT, 24).setOrigin(0.5)
    this.creditText = this.add.bitmapText(centerX, 550, 'fantasy_white', 'PRESS [C] TO RETURN', 50).setOrigin(0.5)

    keyCREDITS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyCREDITS)) {
      restart = true
      this.sound.play('blip01', {volume: 1.0})
      this.time.delayedCall(500, () => {
        this.scene.start('menuScene')
      });
    }
  }
}
