import { Player, Projectile, Enemy, Particle, BackgroundParticle, PowerUp} from './js/classes.js'
import { ctx, canvas } from './js/variables.js'
import { scoreEl, modalEl, modalScoreEl, buttonEl, startButtonEl, startModalEl } from './js/variables.js'

canvas.width = innerWidth
canvas.height = innerHeight
const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, '#ff4500')
let projectiles = []
let enemies = []
let particles = []
let animationId
let intervalId
let score = 0

function init() {
  player = new Player(x, y, 10, '#ff4500')
  projectiles = []
  enemies = []
  particles = []
  animationId
  score = 0
  scoreEl.innerHTML = 0
}

function spawnEnemies() {
  intervalId = setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x
    let y
  
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius 
    }

    const colour = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
    enemies.push(new Enemy(x, y, radius, colour, velocity))
  }, 1000)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  player.draw()

  for (let index = particles.length - 1; index >= 0; index--) {
    const particle = particles[index]
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }  
  }
  
  for (let index = projectiles.length - 1; index >= 0; index--) {
    const projectile = projectiles[index]
    projectile.update()

    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1)
    }
  }

  for (let index = enemies.length - 1; index >= 0; index--) {
    const enemy = enemies[index]
    enemy.update()
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      clearInterval(intervalId)

      modalEl.style.display = 'block'
      gsap.fromTo(
        '#modal-el',
        {
          scale: 0.8,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          ease: 'expo'
        }
      )
      modalScoreEl.innerHTML = score
    }

    for (
      let projectilesIndex = projectiles.length - 1; 
      projectilesIndex >= 0; 
      projectilesIndex--      
    ) {
      const projectile = projectiles[projectilesIndex]
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

      if (dist - enemy.radius - projectile.radius < 1) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
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
          score += 10
          scoreEl.innerHTML = score
          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          projectiles.splice(projectilesIndex, 1)
        } else {
          score += 150
          scoreEl.innerHTML = score
          enemies.splice(index, 1)
          projectiles.splice(projectilesIndex, 1)
        }
      }
    }
  }
}

addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  )
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }
  projectiles.push(
    new Projectile(
      canvas.width / 2,
      canvas.height / 2,
      5,
      '#ffd700',
      velocity
    )
  )
}) 

buttonEl.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()  
  gsap.to('#modal-el', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      modalEl.style.display = 'none'
    }
  })
})

startButtonEl.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  gsap.to('#start-modal-el', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      startModalEl.style.display = 'none'
    }
  })
})

