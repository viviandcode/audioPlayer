require('@babel/polyfill')
import './style.less'

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

import podcastPlayer from "./audioPlay.js"

let audio = new podcastPlayer({
  id: 'myaudio',
  updateTimer: 10
})
audio.src = 'example.m4a'
audio.data(data)
audio.gallery({
  // itemClass: 'gallery-item',
  // activeClass: 'active'
})
audio.tagLine({
  // tagItemClass: ''
})
audio.controllers({
  mode: 'html',
  playIcon: '<i class="fa fa-play" aria-hidden="true"></i>',
  pauseIcon: '<i class="fa fa-pause" aria-hidden="true"></i>',
  backward: true,
  backwardIcon: '<i class="fa fa-backward" aria-hidden="true"></i>',
  forward: true,
  forwardIcon: '<i class="fa fa-forward" aria-hidden="true"></i>'
})
audio.timer()
audio.timeline()