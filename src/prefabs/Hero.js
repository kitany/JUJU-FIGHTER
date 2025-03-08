class Hero extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

    scene.add.existing(this)           // add Hero to existing scene
    scene.physics.add.existing(this)   // add physics body to scene
    this.setScale(0.86)

    this.body.setSize(300, this.height)
    this.body.setImmovable(true)

    this.hp = new HealthBar(scene, HERO_HEALTH_X, HEALTH_Y, 'hero')
    this.health = 350
    this.isDead = false
    this.isAttacking = false

    // state machine managing hero
    scene.heroFSM = new StateMachine('idle', {
      idle: new IdleState(),
      basic: new BasicState(), // Q
      heavy: new HeavyState(), // W
      ult: new UltState(), // E
      hurt: new HurtState(),
    }, [scene, this])   // pass these as arguments to maintain scene/object context in the FSM
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
    
    if (this.health <= 0) {
      this.isDead = true
    } else {
      scene.heroFSM.transition('hurt')
    }
  }

  abilityOnCooldown() {
    
  }
}

// hero-specific state classes
class IdleState extends State {
  enter(scene, hero) {
    // reset position
    hero.x = 150
    hero.updatePhysicsBody('idle')

    hero.anims.play('hero_idle')
    hero.anims.stop()
  }

  execute(scene, hero) {
    if(Phaser.Input.Keyboard.JustDown(keyQ)) {
      this.stateMachine.transition('basic')
      return
    }

    if(Phaser.Input.Keyboard.JustDown(keyW)) {
      this.stateMachine.transition('heavy')
      return
    }

    if(Phaser.Input.Keyboard.JustDown(keyE)) {
      this.stateMachine.transition('ult')
      return
    }
  }
}

class BasicState extends State {
  constructor() {
    super()
    this.movementDistance = 350
    this.movementVelocity = 10
  }

  enter(scene, hero) {
    hero.updatePhysicsBody('basic');

    hero.anims.play('hero_basic')
    scene.sound.play('punch', {volume: 1.0})

    hero.isAttacking = true

    hero.once('animationcomplete', () => {
      hero.isAttacking = false
      this.stateMachine.transition('idle')
    })
    hero.movementRemaining = this.movementDistance
  }

  execute(scene, hero) {
    // move the hero forward along the x-axis
    if (hero.movementRemaining > 0) {
      hero.x += this.movementVelocity
      hero.movementRemaining -= 1
    }
  }
}

class HeavyState extends State {
  constructor() {
    super()
    this.movementDistance = 350
    this.movementVelocity = 10
  }

  enter(scene, hero) {
    hero.updatePhysicsBody('heavy');

    hero.anims.play('hero_heavy')
    scene.sound.play('punch', {volume: 1.0})

    hero.isAttacking = true

    hero.once('animationcomplete', () => {
      hero.isAttacking = false
      this.stateMachine.transition('idle')
    })
    hero.movementRemaining = this.movementDistance
  }

  execute(scene, hero) {
    // move the hero forward along the x-axis
    if (hero.movementRemaining > 0) {
      hero.x += this.movementVelocity
      hero.movementRemaining -= 1
    }
  }
}

class UltState extends State {
  constructor() {
    super()
    this.movementDistance = 200
    this.movementVelocity = 25
  }

  enter(scene, hero) {
    hero.updatePhysicsBody('ult');

    hero.anims.play('hero_ult')
    scene.sound.play('flame', {volume: 1.0})

    hero.isAttacking = true

    hero.once('animationcomplete', () => {
      hero.isAttacking = false
      this.stateMachine.transition('idle')
    })
    hero.movementRemaining = this.movementDistance
  }

  execute(scene, hero) {
    // move the hero forward along the x-axis
    if (hero.movementRemaining > 0) {
      hero.x += this.movementVelocity
      hero.movementRemaining -= 1
    }
  }
}

class HurtState extends State {
  enter(scene, hero) {
    hero.anims.play('hero_idle')
    hero.anims.stop()
    hero.setTint(0xff0000)     // turn red
    // create knockback by sending body in direction opposite facing direction

    // set recovery timer
    scene.time.delayedCall(hero.hurtTimer, () => {
      hero.clearTint()
      this.stateMachine.transition('idle')
    })
  }
}
