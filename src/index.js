require('@babel/polyfill')
import './styles/style.less'
import podcastPlayer from "./player.js"
import data from "./data.js"

const player = new podcastPlayer({
  id: 'myaudio',
  updateTimer: 10
})
player.src = 'example.m4a'
player.data(data)
player.gallery({
  mode: 'render'
})
player.tagLine({
  mode: 'render'
})
player.controllers({
  mode: 'render',
  playIcon: '<i class="fa fa-play" aria-hidden="true"></i>',
  pauseIcon: '<i class="fa fa-pause" aria-hidden="true"></i>',
  backward: true,
  backwardIcon: '<i class="fa fa-undo" aria-hidden="true"></i>',
  forward: true,
  forwardIcon: '<i class="fa fa-repeat" aria-hidden="true"></i>'
})
player.volumeController({
  mode: 'render',
  volumeIcon: '<i class="fa fa-volume-up" aria-hidden="true"></i>',
  muteIcon: '<i class="fa fa-volume-off" aria-hidden="true"></i>'
})
player.timer({
  mode: 'render'
})
player.timeline({
  mode: 'render'
})