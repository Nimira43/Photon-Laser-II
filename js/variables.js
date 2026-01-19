export const state = {
  dom: {
    scoreEl: null,
    modalEl: null,
    modalScoreEl: null,
    buttonEl: null,
    startButtonEl: null,
    startModalEl: null,
    volumeUpEl: null,
    volumeOffEl: null,
  },

  render: {
    canvas: null,
    ctx: null,
    backgroundParticles: []
  },

  game: {
    player: null,
    enemies: [],
    projectiles: [],
    particles: [],
    powerUps: [],
    score: 0,
    frames: 0,
    active: false
  },

  input: {
    mouse: { x: 0, y: 0 }
  },

  timers: {
    enemyInterval: null,
    powerUpInterval: null
  },

  audio: {
    initialised: false
  }
}
