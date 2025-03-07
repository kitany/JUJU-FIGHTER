class HealthBar {

  constructor (scene, x, y)
  {
      this.HEALTH_WIDTH = 340
      this.HEALTH_HEIGHT = 35

      this.bar = new Phaser.GameObjects.Graphics(scene)
      this.x = x
      this.y = y
      this.health = this.HEALTH_WIDTH - 4 // - 2 (x2) for border
      this.p = 1 // percentage health

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
      this.bar.fillStyle(0xffffff)
      this.bar.fillRect(this.x + 2, this.y + 2, this.HEALTH_WIDTH - 4, this.HEALTH_HEIGHT - 4)

      if (this.health < 30) {
          this.bar.fillStyle(0xff0000)
      } else {
          this.bar.fillStyle(0x00ff00)
      }

      var d = Math.floor(this.p * this.health)
      this.bar.fillRect(this.x + 2, this.y + 2, d, this.HEALTH_HEIGHT - 4)
      this.bar.setDepth(4)
  }

}