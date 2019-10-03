require('@babel/polyfill')
import './styles/style.less'
import podcastPlayer from "./player.js"

let data = [
  {
    timePoint: 0,
    title: 'title 0',
    imgUrl: '0.jpg'
  },
  {
    timePoint: 45,
    title: 'title 1',
    imgUrl: '1.jpg'
  },
  {
    timePoint: 90,
    title: 'title 2',
    imgUrl: '2.jpg'
  },
  {
    timePoint: 150,
    title: 'title 3',
    imgUrl: '3.jpg'
  },
  {
    timePoint: 280,
    title: 'title 4',
    imgUrl: '4.jpg'
  }
]

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