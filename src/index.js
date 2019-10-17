require('@babel/polyfill')
import './styles/style.less'
import player from "./init.js"
import data from "./data.js"

const theplayer = new player({
  id: 'podcast',
  updateTimer: 10
})
theplayer.src = 'example.m4a'
theplayer.data(data)

theplayer.playButton({})

theplayer.jumpButton({
  backward: true,
  forward: true
})