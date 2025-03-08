class Clock {
  constructor(scene, x, y) {
    this.scene = scene
    this.x = x - 6
    this.y = y

    this.currentTime = 45000
    this.timerVisual = this.scene.add.bitmapText(this.x, this.y, 'fantasy_white',
      `${this.formatTime(this.currentTime)}`, 55)
      .setOrigin (0.5)
      .setDepth(5)
    this.timerVisual.setDepth(4)
    this.timerStart = false
  }

  formatTime(ms) {
    let s = ms / 1000
    let min = Math.floor(s / 60)
    let sec = Math.floor(s % 60)
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  start() {
    this.timerStart = true
  }

  stop() {
    this.timerStart = false
  }

  update() {
    if (this.timerStart) {
      this.currentTime -= this.scene.game.loop.delta
      this.timerVisual.text = this.formatTime(this.currentTime)

      if (this.currentTime <= 0) {
        this.stop()
        this.timerVisual.text = this.formatTime(0)
      }
    }
  }
}
