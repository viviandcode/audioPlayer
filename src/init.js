import core from "./main.js"
import data from "./data.js"
import './styles/style.less'

const playerCore = new core({
    updateTimer: 10
  })

playerCore.src = 'example.m4a'
playerCore.data(data)

const buttons = playerCore.buttons({
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

const volume = playerCore.volumeController({
    volumeIcon: '<i class="fa fa-volume-up" aria-hidden="true"></i>',
    muteIcon: '<i class="fa fa-volume-off" aria-hidden="true"></i>'
})

const timer = playerCore.timer()

const timeline = playerCore.timeline()

const gallery = playerCore.gallery()

const tagLine = playerCore.tagLine()