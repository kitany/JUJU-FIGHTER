class Encounter extends Phaser.Scene {
  constructor() {
    super('encounterScene')
  }

  init() {
    // dialog constants
    this.DBOX_X = 25		        // dialog box x-position
    this.DBOX_Y = 400			    // dialog box y-position
    this.DBOX_FONT = 'chocolates_black'	    // dialog box font key

    this.TEXT_X = 50			    // text w/in dialog box x-position
    this.TEXT_Y = 460 		    // text w/in dialog box y-position
    this.TEXT_SIZE = 28		        // text font size (in pixels)
    this.TEXT_MAX_WIDTH = 715	    // max width of text within box

    this.SPEAKER_X = centerX			    // text w/in dialog box x-position
    this.SPEAKER_Y = 408		    // text w/in dialog box y-position
    this.SPEAKER_SIZE = 64
    this.SPEAKER_FONT = 'fantasy_black'	   // speaker name font key

    this.NEXT_TEXT = '[SPACE]'	    // text to display for next prompt
    this.NEXT_X = centerX		    // next text prompt x-position
    this.NEXT_Y = 550		    // next text prompt y-position

    this.SKIP_TEXT = '[ENTER to SKIP]'
    this.SKIP_X = centerX
    this.SKIP_Y = 580
    this.SKIP_SIZE = 20

    this.LETTER_TIMER = 10		    // # ms each letter takes to "type" onscreen

    // dialog variables
    this.dialogConvo = 0			// current "conversation"
    this.dialogLine = 0			    // current line of conversation
    this.dialogSpeaker = null		// current speaker
    this.dialogLastSpeaker = null	// last speaker
    this.dialogTyping = false		// flag to lock player input while text is "typing"
    this.dialogText = null			// the actual dialog text
    this.nextText = null			// player prompt text to continue typing
    this.skipText = null
    this.dialogDone = false

    // character variables
    this.tweenDuration = 500        // character in/out tween duration

    this.OFFSCREEN_X = -500         // x,y coordinates used to place characters offscreen
    this.OFFSCREEN_Y = 1300
  }

  create() {
    this.bgimg = this.add.tileSprite(0,0, 800, 600, 'bgimg').setOrigin(0, 0)
    this.bgimg.setScale(1.8)

    // bgm
    this.bgm = this.sound.add('encounter_bgm', {
      volume: 1,
      loop: true,
    });
    this.bgm.play()

    this.hero = new Character(this, this.OFFSCREEN_X, 700, 'hero') // 150
    this.enemy = new Character(this, this.OFFSCREEN_Y, 630, 'enemy') // 650
    this.hero.sprite.setScale(1)
    this.enemy.sprite.setScale(1)

    // parse dialog from JSON file
    this.dialog = this.cache.json.get('dialog')

    // add dialog box sprite
    this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0)

    // initialize dialog text objects (with no text)
    this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)
    this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setOrigin(0.5, 0)
    this.speakerName = this.add.bitmapText(this.SPEAKER_X, this.SPEAKER_Y, this.SPEAKER_FONT, '', this.SPEAKER_SIZE).setOrigin(0.5, 0)
    this.skipText = this.add.bitmapText(this.SKIP_X, this.SKIP_Y, this.DBOX_FONT, '', this.SKIP_SIZE).setOrigin(0.5, 0)

    this.tweens.add({
      targets: this.hero.sprite,
      x: 150,
      duration: this.tweenDuration,
      ease: 'Linear'
    })

    this.tweens.add({
      targets: this.enemy.sprite,
      x: 650,
      duration: this.tweenDuration,
      ease: 'Linear'
    })

    // keys definition
    cursors = this.input.keyboard.createCursorKeys()
    keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    keySKIP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)

    // start first dialog conversation
    this.typeText()        
  }

  update() {
    if(Phaser.Input.Keyboard.JustDown(cursors.space) && !this.dialogTyping) {
      this.typeText() // trigger dialog
      this.sound.play('blip02', {volume: 1.0})
    }

    if(Phaser.Input.Keyboard.JustDown(cursors.space) && this.dialogDone) {
      this.hero.destroy()
      this.enemy.destroy()
      this.sound.play('blip02', {volume: 1.0})
      this.scene.start('playScene')
    }

    if(Phaser.Input.Keyboard.JustDown(keySKIP)) {
      this.sound.play('blip02', {volume: 1.0})
      this.scene.start('playScene')
    }
  }

  typeText() {
    // lock input while typing
    this.dialogTyping = true

    // clear text
    this.dialogText.text = ''
    this.nextText.text = ''
    this.speakerName.destroy()

    // make sure there are lines left to read in this convo, otherwise jump to next convo
    if(this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
      this.dialogLine = 0
      // I increment the conversation count here...
      // ..but you could create logic to exit if each conversation was self-contained
      this.dialogConvo++
    }
    
    // make sure we haven't run out of conversations...
    if(this.dialogConvo >= this.dialog.length) {
      // make text box invisible
      this.dialogbox.visible = false

      // end conversation, start new scene
      this.dialogDone = true
      this.scene.start('playScene')

    } else {
      // if not, set current speaker
      this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker']
      let dialogSprite = this.dialogSpeaker == 'hero' ? this.hero.sprite : this.enemy.sprite

      // tint inactive speaker
      if (this.dialogSpeaker == 'enemy') {
        this.hero.sprite.setTint(0x808080)
        this.enemy.sprite.clearTint()
      } else if (this.dialogSpeaker == 'hero') {
        this.hero.sprite.clearTint()
        this.enemy.sprite.setTint(0x808080)
      }
      
      // check if there's a new speaker (for exit/enter animations)
      if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
        // tween in new speaker's image
        this.tweens.addCounter({
          from: 0.9,
          to: 0.95,
          duration: 150,
          yoyo: true,
          onUpdate: (tween) => {
            const v = tween.getValue();
            dialogSprite.setScale(v + .1);
          },
        });
      }

      this.speakerName = 
      this.add.bitmapText(this.SPEAKER_X, this.SPEAKER_Y, this.SPEAKER_FONT,
        `${this.dialog[this.dialogConvo][this.dialogLine]['speaker'].toUpperCase()}`,
        this.SPEAKER_SIZE).setOrigin(0.5, 0)

      // build dialog (concatenate speaker + colon + line of text)
      this.speakerDialog = this.dialog[this.dialogConvo][this.dialogLine]['dialog']

      // create a timer to iterate through each letter in the dialog text
      let currentChar = 0
      this.textTimer = this.time.addEvent({
        delay: this.LETTER_TIMER,
        repeat: this.speakerDialog.length - 1,
        callback: () => { 
          // concatenate next letter from dialogLines
          this.dialogText.text += this.speakerDialog[currentChar]
          // advance character position
          currentChar++
          // check if timer has exhausted its repeats 
          // (necessary since Phaser 3 no longer seems to have an onComplete event)
          if(this.textTimer.getRepeatCount() == 0) {
            // show prompt for more text
            this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(0.5, 1)
            this.skipText = this.add.bitmapText(this.SKIP_X, this.SKIP_Y, this.DBOX_FONT, this.SKIP_TEXT, this.SKIP_SIZE).setOrigin(0.5, 1)
            this.dialogTyping = false   // un-lock input
            this.textTimer.destroy()    // destroy timer
          }
        },
        callbackScope: this // keep Scene context
      })
        
      // final cleanup before next iteration
      this.dialogText.maxWidth = this.TEXT_MAX_WIDTH  // set bounds on dialog
      this.dialogLine++                               // increment dialog line
      this.dialogLastSpeaker = this.dialogSpeaker     // set past speaker
    }
  }
}