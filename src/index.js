let data = [
  {
    timePoint: 0,
    imgUrl: '0.jpg'
  },
  {
    timePoint: 45,
    imgUrl: '1.jpg'
  },
  {
    timePoint: 90,
    imgUrl: '2.jpg'
  },
  {
    timePoint: 150,
    imgUrl: '3.jpg'
  },
  {
    timePoint: 280,
    imgUrl: '4.jpg'
  }
]

require('./style.css')

import { AudioPlayer }  from "./audioPlay.js"

let audio = new AudioPlayer({
  id: 'myaudio',
  // src: 'example.m4a',
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
