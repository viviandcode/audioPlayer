// require('@babel/polyfill')
import './styles/style.less'
import player from "./init.js"
import data from "./data.js"

const thePlayer = new player({
    id: 'podcast',
    updateTimer: 10
})
thePlayer.src = 'example.m4a'

thePlayer.data(data)
thePlayer.gallery({})
thePlayer.tagLine({})

thePlayer.customButton()

thePlayer.playButton({
    className: 'play-button',
    playIcon: '<i class="fa fa-play" aria-hidden="true"></i>',
    pauseIcon: '<i class="fa fa-pause" aria-hidden="true"></i>'
})

thePlayer.skipTimeButton({
    backward: true,
    backwardIcon: '<i class="fa fa-undo" aria-hidden="true"></i>',
    forward: true,
    forwardIcon: '<i class="fa fa-repeat" aria-hidden="true"></i>'
})

thePlayer.prevNextButton({
    prev: true,
    prevIcon: '<i class="fa fa-backward" aria-hidden="true"></i>',
    prevFunc () { console.log('prev fuction') },
    next: true,
    nextIcon: '<i class="fa fa-forward" aria-hidden="true"></i>',
    nextFunc () { console.log('next function') }
    // nextFunc: () => { console.log('next function') }
})

thePlayer.volumeController({
    volumeIcon: '<i class="fa fa-volume-up" aria-hidden="true"></i>',
    muteIcon: '<i class="fa fa-volume-off" aria-hidden="true"></i>'
})

thePlayer.timer()

thePlayer.timeline({})
