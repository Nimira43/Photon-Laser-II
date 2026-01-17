import { ctx, friction } from './variables.js'

export class Player {
  constructor(x, y, radius, colour) {
    this.x = x
    this.y = y
    this.radius = radius
    this.colour = colour
  }
  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.colour
    ctx.fill()
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
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.colour
    ctx.fill()
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

export class Enemy {
  constructor(x, y, radius, colour, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.colour = colour
    this.velocity = velocity
  }
  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.colour
    ctx.fill()
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
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
    ctx.save()
    ctx.globalAlpha = this.alpha 
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.colour
    ctx.fill()
    ctx.restore()
  }
  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

export class BackgroundParticle {} 
export class PowerUp {} 