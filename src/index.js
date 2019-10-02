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

import { podcastPlayer }  from "./audioPlay.js"

let audio = new podcastPlayer({
  id: 'myaudio',
  // src: 'example.m4a',
  playIcon: '<i class="fa fa-play" aria-hidden="true"></i>',
  pauseIcon: '<i class="fa fa-pause" aria-hidden="true"></i>',
  updateTimer: 10
})
audio.src = 'example.m4a'
audio.timer()
audio.timeline()
audio.gallery({
  data: data
  // itemClass: 'gallery-item',
  // activeClass: 'active'
})
audio.tagLine({
  data: data,
  // tagItemClass: ''
})
