class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y, texture, name)

    scene.add.existing(this)           // add Enemy to existing scene
    scene.physics.add.existing(this)   // add physics body to scene

    this.body.setSize(250, this.height)
    this.body.setImmovable(true)

    this.hp = new HealthBar(scene, ENEMY_HEALTH_X, HEALTH_Y)
    this.health = 350
    this.isDead = false

    // state machine managing enemy
    scene.enemyFSM = new StateMachine('idle', {
      idle: new IdleStateEnemy(),
      basic: new BasicStateEnemy(), // Q
      heavy: new HeavyStateEnemy(), // W
      ult: new UltStateEnemy(), // E
      hurt: new HurtStateEnemy(),
    }, [scene, this])
  }

  updatePhysicsBody(state) {
    switch (state) {
      case 'idle':
        this.body.setSize(300, this.height);  // Standard size
        break;
      default:
        this.body.setSize(600, this.height); 
        break;
    }
  }

  decreaseHealth(scene, amount) {
    this.health -= amount
    const isDead = this.hp.decrease(amount)
    // console.log(isDead)
    
    if (this.health <= 0) {
      this.isDead = true
    } else {
      scene.enemyFSM.transition('hurt')
    }
  }
}

// enemy-specific state classes
class IdleStateEnemy extends State {
  enter(scene, enemy) {
    // reset position
    enemy.x = 650
    enemy.updatePhysicsBody('idle');

    enemy.anims.play('enemy_idle')
    enemy.anims.stop()
  }

  execute(scene, enemy) {
    // if(Phaser.Input.Keyboard.JustDown(keyQ)) {
    //   this.stateMachine.transition('basic')
    //   return
    // }

    // if(Phaser.Input.Keyboard.JustDown(keyW)) {
    //   this.stateMachine.transition('ability')
    //   return
    // }

    // if(Phaser.Input.Keyboard.JustDown(keyE)) {
    //   this.stateMachine.transition('ult')
    //   return
    // }
  }
}

class BasicStateEnemy extends State {
  constructor() {
    super()
    this.movementDistance = 350
    this.movementVelocity = 10
  }

  enter(scene, enemy) {
    enemy.updatePhysicsBody('basic');

    enemy.anims.play('enemy_basic')
    enemy.once('animationcomplete', () => {
      this.stateMachine.transition('idle')
    })
    enemy.movementRemaining = this.movementDistance
  }

  execute(scene, enemy) {
    // move the enemy forward along the x-axis
    if (enemy.movementRemaining > 0) {
      enemy.x += this.movementVelocity
      enemy.movementRemaining -= 1
    }
  }
}

class HeavyStateEnemy extends State {
  constructor() {
    super()
    this.movementDistance = 350
    this.movementVelocity = 10
  }

  enter(scene, enemy) {
    enemy.updatePhysicsBody('heavy');

    enemy.anims.play('enemy_heavy')
    enemy.once('animationcomplete', () => {
      this.stateMachine.transition('idle')
    })
    enemy.movementRemaining = this.movementDistance
  }

  execute(scene, enemy) {
    // move the enemy forward along the x-axis
    if (enemy.movementRemaining > 0) {
      enemy.x += this.movementVelocity
      enemy.movementRemaining -= 1
    }
  }
}

class UltStateEnemy extends State {
  constructor() {
    super()
    this.movementDistance = 200
    this.movementVelocity = 25
  }

  enter(scene, enemy) {
    enemy.updatePhysicsBody('ult');

    enemy.anims.play('enemy_ult')
    enemy.once('animationcomplete', () => {
      this.stateMachine.transition('idle')
    })
    enemy.movementRemaining = this.movementDistance
  }

  execute(scene, enemy) {
    // move the enemy forward along the x-axis
    if (enemy.movementRemaining > 0) {
      enemy.x += this.movementVelocity
      enemy.movementRemaining -= 1
    }
  }
}

class HurtStateEnemy extends State {
  enter(scene, enemy) {
    enemy.anims.play('enemy_idle')
    enemy.anims.stop()
    enemy.setTint(0xFF0000)     // turn red
    // create knockback by sending body in direction opposite facing direction

    // set recovery timer
    scene.time.delayedCall(enemy.hurtTimer, () => {
      enemy.clearTint()
      this.stateMachine.transition('idle')
    })
  }
}
