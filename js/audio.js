const audio = {
  shoot: new Howl({
    src: '../assets/audio/shoot.wav',
    volume: 0.04
  }),
  damageTaken: new Howl({
    src: '../assets/audio/damage.wav',
    volume: 0.1
  }),
  explode: new Howl({
    src: '../assets/audio/explosion.wav',
    volume: 0.1
  }),
  death: new Howl({
    src: '../assets/audio/death.wav',
    volume: 0.1
  }),
  powerUpNoise: new Howl({
    src: '../assets/audio/powerup.wav',
    volume: 0.1
  }),
  select: new Howl({
    src: '../assets/audio/select.wav',
    volume: 0.1
  }),
  background: new Howl({
    src: '../assets/audio/hyper.wav',
    volume: 0.1
  }),
}