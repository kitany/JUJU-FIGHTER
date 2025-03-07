class Ability {
  constructor(scene, x, y, key, keyChar, cooldown) {
    this.scene = scene
    this.x = x
    this.y = y
    this.key = key
    this.keyChar = keyChar
    this.cooldownTime = cooldown // in ms
    this.lastUsedTime = 0
    this.isOnCooldown = false
    this.INACTIVE = 0xb0b0b0 // grey color
    this.ACTIVE = 0xe28aff // violet
    this.ALPHA = 0.8

    // Cooldown bar initial dimensions
    this.CD_WIDTH = 80 // Full width of the cooldown bar
    this.CD_HEIGHT = 70 // Height of the cooldown bar

    // Create a visual representation of the ability (optional)
    this.text = this.scene.add.bitmapText(this.x + this.CD_WIDTH / 2 - 7, this.y + this.CD_HEIGHT / 2 + 2, 'fantasy_white', this.keyChar, 60).setOrigin(0.5)
    this.text.setDepth(5)

    // Create a graphics object to draw the cooldown bar
    this.cooldownBar = this.scene.add.graphics()
    this.cooldownBar.fillStyle(this.INACTIVE, this.ALPHA).setDepth(5) // grey
  }

  // Method to handle the ability activation
  activateAbility() {
    if (this.isOnCooldown) return

    const currentTime = this.scene.time.now

    // Start the cooldown
    this.isOnCooldown = true
    this.lastUsedTime = currentTime

    // Set a timer to re-enable the ability after cooldown ends
    this.scene.time.delayedCall(this.cooldownTime, () => {
      this.isOnCooldown = false
      // console.log('off cooldown')
    });
  }

  // Update method to check the key input and cooldown status
  update() {
    // Check if the key is pressed and the ability is not on cooldown
    if (this.key.isDown && !this.isOnCooldown) {
      // console.log(`${this.keyChar} pressed`)
      this.activateAbility()
    }

    if (this.isOnCooldown) {
      const currentTime = this.scene.time.now
      const elapsedTime = currentTime - this.lastUsedTime
      const remainingTime = Math.max(0, this.cooldownTime - elapsedTime)

      // Calculate the width of the cooldown bar based on the remaining time
      const remainingWidth = (remainingTime / this.cooldownTime) * this.CD_WIDTH

      // Clear the previous graphics and redraw the updated cooldown bar
      this.cooldownBar.clear();
      this.cooldownBar.fillStyle(this.INACTIVE, this.ALPHA) // Green color for the cooldown bar
      this.cooldownBar.fillRect(this.x, this.y, remainingWidth, this.CD_HEIGHT)
    } else {
      // If not on cooldown, reset the cooldown bar to full width
      this.cooldownBar.clear();
      this.cooldownBar.fillStyle(this.ACTIVE, this.ALPHA) // violet when active
      this.cooldownBar.fillRect(this.x, this.y, this.CD_WIDTH, this.CD_HEIGHT)
    }

    this.cooldownBar.setDepth(4) // Ensure the bar is drawn above other elements
  }
}
