import { state } from './variables.js'
import { audio } from './audio.js'
import {
  Player,
  Projectile,
  Enemy,
  Particle,
  BackgroundParticle,
  PowerUp
} from './classes.js'

export function init() {
  const { canvas } = state.render

  const x = canvas.width / 2
  const y = canvas.height / 2

  state.game.player = new Player(x, y, 10, '#ff4500')
  state.game.enemies = []
  state.game.projectiles = []
  state.game.particles = []
  state.game.powerUps = []
  state.render.backgroundParticles = []
  state.game.score = 0
  state.game.frames = 0
  state.game.active = true

  state.dom.scoreEl.innerHTML = 0

  const spacing = 30
  for (let x = 0; x < canvas.width + spacing; x += spacing) {
    for (let y = 0; y < canvas.height + spacing; y += spacing) {
      state.render.backgroundParticles.push(
        new BackgroundParticle({
          position: { x, y },
          radius: 3
        })
      )
    }
  }
}

export function spawnEnemies() {
  state.timers.enemyInterval = setInterval(() => {
    const { canvas } = state.render
    const radius = Math.random() * (30 - 4) + 4
    let x, y

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? -radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? -radius : canvas.height + radius
    }

    const colour = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

    const velocity = { x: Math.cos(angle), y: Math.sin(angle) }

    state.game.enemies.push(new Enemy(x, y, radius, colour, velocity))
  }, 1000)
}

export function spawnPowerUps() {
  const { canvas } = state.render

  state.timers.powerUpInterval = setInterval(() => {
    state.game.powerUps.push(
      new PowerUp({
        position: { x: -30, y: Math.random() * canvas.height },
        velocity: { x: Math.random() + 2, y: 0 }
      })
    )
  }, 10000)
}

export function createScoreLabel({ position, score }) {
  const label = document.createElement('label')
  label.innerHTML = score
  label.style.color = 'white'
  label.style.position = 'absolute'
  label.style.left = position.x + 'px'
  label.style.top = position.y + 'px'
  label.style.pointerEvents = 'none'
  label.style.userSelect = 'none'
  document.body.appendChild(label)

  gsap.to(label, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => label.remove()
  })
}

export function animate() {
  const { canvas, ctx, backgroundParticles } = state.render
  const { player, enemies, projectiles, particles, powerUps } = state.game

  state.game.frames++
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  backgroundParticles.forEach(bp => {
    bp.draw()
    const dist = Math.hypot(player.x - bp.position.x, player.y - bp.position.y)

    if (dist < 100) {
      bp.alpha = dist > 70 ? 0.5 : 0
    } else {
      bp.alpha += bp.alpha < 0.1 ? 0.01 : -0.01
    }
  })

  player.update()

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i]

    if (p.position.x > canvas.width) {
      powerUps.splice(i, 1)
      continue
    }

    p.update()

    const dist = Math.hypot(player.x - p.position.x, player.y - p.position.y)
    if (dist < p.image.height / 2 + player.radius) {
      powerUps.splice(i, 1)
      player.powerUp = 'MachineGun'
      player.colour = 'yellow'
      audio.powerUpNoise.play()

      setTimeout(() => {
        player.powerUp = null
        player.colour = '#ff4500'
      }, 5000)
    }
  }

  if (player.powerUp === 'MachineGun') {
    const angle = Math.atan2(
      state.input.mouse.y - player.y,
      state.input.mouse.x - player.x
    )

    const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }

    if (state.game.frames % 2 === 0) {
      projectiles.push(new Projectile(player.x, player.y, 5, 'yellow', velocity))
    }

    if (state.game.frames % 5 === 0) audio.shoot.play()
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    if (p.alpha <= 0) particles.splice(i, 1)
    else p.update()
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i]
    proj.update()

    if (
      proj.x - proj.radius < 0 ||
      proj.x - proj.radius > canvas.width ||
      proj.y + proj.radius < 0 ||
      proj.y - proj.radius > canvas.height
    ) {
      projectiles.splice(i, 1)
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i]
    enemy.update()

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(state.game.animationId)
      clearInterval(state.timers.enemyInterval)
      clearInterval(state.timers.powerUpInterval)
      audio.death.play()
      state.game.active = false

      state.dom.modalEl.style.display = 'block'
      gsap.fromTo(
        '#modal-el',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'expo' }
      )
      state.dom.modalScoreEl.innerHTML = state.game.score
      return
    }

    for (let j = projectiles.length - 1; j >= 0; j--) {
      const proj = projectiles[j]
      const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y)

      if (dist - enemy.radius - proj.radius < 1) {
        for (let k = 0; k < enemy.radius * 2; k++) {
          particles.push(
            new Particle(
              proj.x,
              proj.y,
              Math.random() * 2,
              enemy.colour,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6)
              }
            )
          )
        }

        if (enemy.radius - 10 > 5) {
          audio.damageTaken.play()
          state.game.score += 100
          state.dom.scoreEl.innerHTML = state.game.score

          gsap.to(enemy, { radius: enemy.radius - 10 })

          createScoreLabel({
            position: { x: proj.x, y: proj.y },
            score: 100
          })

          projectiles.splice(j, 1)
        } else {
          audio.explode.play()
          state.game.score += 150
          state.dom.scoreEl.innerHTML = state.game.score

          createScoreLabel({
            position: { x: proj.x, y: proj.y },
            score: 150
          })

          enemies.splice(i, 1)
          projectiles.splice(j, 1)
        }
      }
    }
  }

  state.game.animationId = requestAnimationFrame(animate)
}

export function shoot({ x, y }) {
  if (!state.game.active) return

  const player = state.game.player
  const angle = Math.atan2(y - player.y, x - player.x)
  const velocity = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 }

  state.game.projectiles.push(
    new Projectile(player.x, player.y, 5, '#ffd700', velocity)
  )

  audio.shoot.play()
}
