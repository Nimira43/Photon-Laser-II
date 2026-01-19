import { state } from './variables.js'
import { audio } from './audio.js'
import {
  init,
  animate,
  spawnEnemies,
  spawnPowerUps,
  shoot
} from './methods.js'

// DOM + canvas setup
state.render.canvas = document.querySelector('canvas')
state.render.ctx = state.render.canvas.getContext('2d')

state.dom.scoreEl = document.querySelector('#score-el')
state.dom.modalEl = document.querySelector('#modal-el')
state.dom.modalScoreEl = document.querySelector('#modal-score-el')
state.dom.buttonEl = document.querySelector('#button-el')
state.dom.startButtonEl = document.querySelector('#start-button-el')
state.dom.startModalEl = document.querySelector('#start-modal-el')
state.dom.volumeUpEl = document.querySelector('#volume-up-el')
state.dom.volumeOffEl = document.querySelector('#volume-off-el')

state.render.canvas.width = innerWidth
state.render.canvas.height = innerHeight

// Input
window.addEventListener('mousemove', e => {
  state.input.mouse.x = e.clientX
  state.input.mouse.y = e.clientY
})

window.addEventListener('touchmove', e => {
  state.input.mouse.x = e.touches[0].clientX
  state.input.mouse.y = e.touches[0].clientY
})

// Start button
state.dom.startButtonEl.addEventListener('click', () => {
  audio.select.play()
  init()
  animate()
  spawnEnemies()
  spawnPowerUps()

  gsap.to('#start-modal-el', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      state.dom.startModalEl.style.display = 'none'
    }
  })
})

// Try Again button
state.dom.buttonEl.addEventListener('click', () => {
  audio.select.play()
  init()
  animate()
  spawnEnemies()
  spawnPowerUps()

  gsap.to('#modal-el', {
    opacity: 0,
    scale: 0.8,
    duration: 0.2,
    ease: 'expo.in',
    onComplete: () => {
      state.dom.modalEl.style.display = 'none'
    }
  })
})

// Click to shoot
window.addEventListener('click', e => {
  if (!audio.background.playing() && !state.audio.initialised) {
    audio.background.play()
    state.audio.initialised = true
  }

  shoot({ x: e.clientX, y: e.clientY })
})

// Touch to shoot
window.addEventListener('touchstart', e => {
  const x = e.touches[0].clientX
  const y = e.touches[0].clientY
  shoot({ x, y })
})

// Volume toggle
state.dom.volumeUpEl.addEventListener('click', () => {
  audio.background.pause()
  state.dom.volumeOffEl.style.display = 'block'
  state.dom.volumeUpEl.style.display = 'none'

  for (let key in audio) audio[key].mute(true)
})

state.dom.volumeOffEl.addEventListener('click', () => {
  if (state.audio.initialised) audio.background.play()
  state.dom.volumeOffEl.style.display = 'none'
  state.dom.volumeUpEl.style.display = 'block'

  for (let key in audio) audio[key].mute(false)
})

// Resize
window.addEventListener('resize', () => {
  state.render.canvas.width = innerWidth
  state.render.canvas.height = innerHeight
})

// Pause/resume on tab change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(state.timers.enemyInterval)
    clearInterval(state.timers.powerUpInterval)
  } else {
    spawnEnemies()
    spawnPowerUps()
  }
})

// Keyboard movement
window.addEventListener('keydown', e => {
  const player = state.game.player
  if (!player) return

  switch (e.key) {
    case 'ArrowRight': player.velocity.x += 1; break
    case 'ArrowUp':    player.velocity.y -= 1; break
    case 'ArrowLeft':  player.velocity.x -= 1; break
    case 'ArrowDown':  player.velocity.y += 1; break
  }
})


