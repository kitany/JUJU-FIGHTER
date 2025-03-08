class HealthBar {

  constructor (scene, x, y, character)
  {
    this.HEALTH_WIDTH = 340
    this.HEALTH_HEIGHT = 35

    this.bar = new Phaser.GameObjects.Graphics(scene)
    this.x = x
    this.y = y
    this.health = this.HEALTH_WIDTH - 4 // - 2 (x2) for border
    this.p = 1 // percentage health
    this.character = character

    this.draw()
    scene.add.existing(this.bar)
  }

  decrease (amount)
  {
    this.health -= amount;

    if (this.health < 0){
        this.health = 0
    }

    this.draw()

    return (this.health === 0)
  }

  draw ()
  {
    this.bar.clear()

    // bg
    this.bar.fillStyle(0x000000)
    this.bar.fillRect(this.x, this.y, 340, this.HEALTH_HEIGHT)

    // health
    // this.bar.fillStyle(0xffffff)
    // this.bar.fillRect(this.x + 2, this.y + 2, this.HEALTH_WIDTH - 4, this.HEALTH_HEIGHT - 4)

    if (this.character == 'hero') {
      this.bar.fillStyle(0xe28aff) // violet
    } else {
      this.bar.fillStyle(0x6291f0) // blue
    }
    // if (this.health < 70) {
    //   this.bar.fillStyle(0xff0000) // red
    // } else if (this.health < 200) {
    //   this.bar.fillStyle(0xffff00) // yellow
    // } else {
    //   this.bar.fillStyle(0x00ff00) // green
    // }

    if (this.character == 'hero') {
      var d = Math.floor(this.p * this.health)
      var diff = this.x + this.HEALTH_WIDTH - d - 2
      this.bar.fillRect(diff, this.y + 2, d, this.HEALTH_HEIGHT - 4)
      this.bar.setDepth(4)
    } else {
      var d = Math.floor(this.p * this.health)
      this.bar.fillRect(this.x + 2, this.y + 2, d, this.HEALTH_HEIGHT - 4)
      this.bar.setDepth(4)
    }
  }

}