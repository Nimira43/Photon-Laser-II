import { state } from './variables.js'

const friction = 0.99

export class Player {
  constructor(x, y, radius, colour) {
    this.x = x
    this.y = y
    this.radius = radius
    this.colour = colour
    this.velocity = { x: 0, y: 0 }
    this.powerUp = null
  }

  draw() {
    const ctx = state.render.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.colour
    ctx.fill()
  }

  update() {
    const canvas = state.render.canvas
    this.draw()

    this.velocity.x *= friction
    this.velocity.y *= friction

    if (
      this.x + this.radius + this.velocity.x <= canvas.width &&
      this.x - this.radius + this.velocity.x >= 0
    ) {
      this.x += this.velocity.x
    } else this.velocity.x = 0

    if (
      this.y + this.radius + this.velocity.y <= canvas.height &&
      this.y - this.radius + this.velocity.y >= 0
    ) {
      this.y += this.velocity.y
    } else this.velocity.y = 0
  }
}

export class Projectile {
  constructor(x, y, radius, colour, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.colour = colour
    this.velocity = velocity
  }

  draw() {
    const ctx = state.render.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.colour
    ctx.fill()
  }

  update() {
    this.draw()
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
}

export class Enemy {
  constructor(x, y, radius, colour, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.colour = colour
    this.velocity = velocity
    this.type = 'Linear'
    this.radians = 0
    this.centre = { x, y }

    if (Math.random() < 0.5) {
      this.type = 'Homing'
      if (Math.random() < 0.5) {
        this.type = 'Spinning'
        if (Math.random() < 0.5) {
          this.type = 'Homing Spinning'
        }
      }
    }
  }

  draw() {
    const ctx = state.render.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.colour
    ctx.fill()
  }

  update() {
    const player = state.game.player
    this.draw()

    if (this.type === 'Spinning') {
      this.radians += 0.1
      this.centre.x += this.velocity.x
      this.centre.y += this.velocity.y
      this.x = this.centre.x + Math.cos(this.radians) * 30
      this.y = this.centre.y + Math.sin(this.radians) * 30

    } else if (this.type === 'Homing') {
      const angle = Math.atan2(player.y - this.y, player.x - this.x)
      this.velocity.x = Math.cos(angle)
      this.velocity.y = Math.sin(angle)
      this.x += this.velocity.x
      this.y += this.velocity.y

    } else if (this.type === 'Homing Spinning') {
      this.radians += 0.1
      const angle = Math.atan2(player.y - this.centre.y, player.x - this.centre.x)
      this.velocity.x = Math.cos(angle)
      this.velocity.y = Math.sin(angle)
      this.centre.x += this.velocity.x
      this.centre.y += this.velocity.y
      this.x = this.centre.x + Math.cos(this.radians) * 30
      this.y = this.centre.y + Math.sin(this.radians) * 30

    } else {
      this.x += this.velocity.x
      this.y += this.velocity.y
    }
  }
}

export class Particle {
  constructor(x, y, radius, colour, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.colour = colour
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    const ctx = state.render.ctx
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.colour
    ctx.fill()
    ctx.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.alpha -= 0.01
  }
}

export class BackgroundParticle {
  constructor({ position, radius = 3, colour = '#8b0000' }) {
    this.position = position
    this.radius = radius
    this.colour = colour
    this.alpha = 0.1
  }

  draw() {
    const ctx = state.render.ctx
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.colour
    ctx.fill()
    ctx.restore()
  }
}

export class PowerUp {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.image = new Image()
    this.image.src = '../assets/images/lightningBolt.png'
    this.alpha = 1
    this.radians = 0

    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      repeat: -1,
      yoyo: true,
      ease: 'linear'
    })
  }

  draw() {
    const ctx = state.render.ctx
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.translate(
      this.position.x + this.image.width / 2,
      this.position.y + this.image.height / 2
    )
    ctx.rotate(this.radians)
    ctx.translate(
      -this.position.x - this.image.width / 2,
      -this.position.y - this.image.height / 2
    )
    ctx.drawImage(this.image, this.position.x, this.position.y)
    ctx.restore()
  }

  update() {
    this.draw()
    this.radians += 0.01
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}


