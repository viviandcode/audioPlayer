require('@babel/polyfill')
import './styles/style.less'
import podcastPlayer from "./player.js"
import data from "./data.js"

let custom = document.createElement('div')
custom.className = 'wrap'

let icons = [
  '<i class="fa fa-thumbs-up" aria-hidden="true"></i><span>211</span>',
  '<i class="fa fa-comment" aria-hidden="true"></i><span>68</span>',
  '<i class="fa fa-bookmark" aria-hidden="true"></i><span>68</span>',
  '<i class="fa fa-share" aria-hidden="true"></i><span>Share</span>',
]

for (let index = 0; index < icons.length; index++) {
  let button = document.createElement('a')
  button.className = 'button'
  button.innerHTML = icons[index]
  custom.append(button)
}


const player = new podcastPlayer({
  id: 'podcast',
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
player.buttons({
  mode: 'render',
  playIcon: '<i class="fa fa-play" aria-hidden="true"></i>',
  pauseIcon: '<i class="fa fa-pause" aria-hidden="true"></i>',
  backward: true,
  backwardIcon: '<i class="fa fa-undo" aria-hidden="true"></i>',
  forward: true,
  forwardIcon: '<i class="fa fa-repeat" aria-hidden="true"></i>',
  prev: true,
  prevIcon: '<i class="fa fa-backward" aria-hidden="true"></i>',
  prevFunc: () => { alert('prev login!') },
  next: true,
  nextIcon: '<i class="fa fa-forward" aria-hidden="true"></i>',
  nextFunc: () => { alert('next login!') },
  customButtons: custom
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