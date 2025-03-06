class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y, texture, name)

    this.sprite = scene.physics.add.sprite(x, y, texture)
    this.sprite.setOrigin(0.5, 0.5)
    this.sprite.setImmovable(true)
    this.name = name
    this.health = 100
  }

  createAttack(scene, direction) {
    const attack = scene.physics.add.sprite(this.sprite.x + direction, this.sprite.y, 'attack');
    attack.setOrigin(0.5, 0.5);
    attack.setVelocityX(direction === 1 ? 200 : -200);

    // Handle collision detection with the opponent
    if (this.name === 'Player 1') {
      scene.physics.add.collider(attack, player2.sprite, () => {
        player2Health -= 10;
        attack.destroy();
        updateHealth.call(scene);
      });
    } else {
      scene.physics.add.collider(attack, player1.sprite, () => {
        player1Health -= 10;
        attack.destroy();
        updateHealth.call(scene);
      });
    }
  }

  update() {
  }
  
  reset() {
  }
}
