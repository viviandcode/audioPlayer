import { timeFormat } from '../utils/timeFormat.js'
import { timelineInit, timelinePlayProcess, mouseMoveTimelineDot, mouseClickProgressBar } from './timeline.js'
import { galleryActive } from './gallery.js'
import { tagLineProgress, tagLineDrag } from './tagLine.js'
import { mouseMoveVolumeDot, mouseClickVolumeProgressBar } from './volume.js'

export default class core {
    constructor({ src, updateTime }) {
        // declare a object, passing by referrence
        // init modules load status
        this.timerLoaded = false

        this.timeline = {}
        this.timeline.loaded = false
        this.timeline.currentDot = {}
        this.timeline.currentDot.mouseDownStatus = false

        this.galleryLoaded = false
        this.tagLineLoaded = false

        // this.timelineCurrentDot = {}
        // this.timelineCurrentDot.mouseDownStatus = false

        // create audio element
        this.audio = document.createElement('audio')
        this.audio.classList.add('audio')

        if (src !== undefined && src !== '') {
            this.audio.src = src
        }

        // updateTime, default 20 millisecond
        if (updateTime !== undefined && updateTime !== 0) {
            this.updateTime = updateTime
        } else {
            this.updateTime = 20
        }

        this.monitor()
    }

    set src (src) {
        this.audio.src = src
    }
    get src () {
        return this.audio.src
    }

    set loop (loop) {
        if (loop === true) {
            this.audio.loop = true
        }
    }
    get loop () {
        return this.audio.loop
    }

    set autoplay (autoplay) {
        if (autoplay === true) {
            this.audio.autoplay = true
        }
    }
    get autoplay () {
        return this.audio.autoplay
    }

    set volume (volume) {
            this.audio.volume = volume
    }
    get volume () {
        return this.audio.volume
    }

    data (data) {
        this.data = data
    }

    // monitor play process
    monitor () {
        let setIntervalObj
        this.audio.addEventListener('play', () => {
            // change play button icon
            this.playButton.innerHTML = this.pauseIcon

            setIntervalObj = setInterval(() => {
                // update timer
                if (this.timerLoaded) {
                    this.current.innerText = timeFormat(this.audio.currentTime)
                }

                // update timeline dot postation
                if (this.timeline.loaded) {
                    timelinePlayProcess({
                        audio: this.audio,
                        dot: this.timeline.currentDot
                    })
                }

                // gallery seek active item
                if (this.galleryLoaded) {
                    this.galleryIndex = galleryActive({
                        audio: this.audio,
                        galleryItems: this.galleryItems,
                        itemClass: this.galleryItemClass,
                        activeClass: this.galleryActiveClass,
                        galleryIndex: this.galleryIndex
                    })
                }

                // tag line
                if (this.tagLineLoaded) {
                    tagLineProgress({
                        audio: this.audio,
                        progressDistance: this.progressDistance,
                        progress: this.progress
                    })
                }
            }, this.updateTime)
        }, false)

        this.audio.addEventListener('pause', () => {
            this.playButton.innerHTML = this.playIcon
            clearInterval(setIntervalObj)
        })
    }

    playButton ({ playIcon, pauseIcon, className }) {
        if (playIcon === undefined || playIcon === '') {
            this.playIcon = '&#9658'
        } else {
            this.playIcon = playIcon
        }

        if (pauseIcon === undefined || pauseIcon === '') {
            this.pauseIcon = '&Iota;&Iota;'
        } else {
            this.pauseIcon = pauseIcon
        }

        this.playButton = document.createElement('button')
        if (className === undefined || className === '') {
            this.playButton.className = 'play-button'
        } else {
            this.playButton.className = className
        }
        this.playButton.innerHTML = this.playIcon
        this.playButton.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play()
            } else {
                this.audio.pause()
            }
        })

        return this.playButton
    }

    skipTimeButton ({ skipTime, backward, backwardClass, backwardIcon, forward, forwardClass, forwardIcon }) {
        let backwardButton, forwardButton

        if (skipTime === undefined || skipTime === 0) {
            this.skipTime = 15
        } else {
            this.skipTime = skipTime
        }

        if (backward) {
            backwardButton = document.createElement('button')
            if (backwardClass === undefined || backwardClass === '') {
                backwardButton.className = 'backward-button'
            } else {
                backwardButton.className = backwardClass
            }
            if (backwardIcon === undefined || backwardIcon === '') {
                backwardButton.innerHTML = '&#8634'
            } else {
                backwardButton.innerHTML = backwardIcon
            }
            backwardButton.addEventListener('click', () => {
                this.audio.currentTime -= this.skipTime
                this.audio.play()
            })
        }

        if (forward) {
            forwardButton = document.createElement('button')
            if (forwardClass === undefined || forwardClass === '') {
                forwardButton.className = 'forward-button'
            } else {
                forwardButton.className = forwardClass
            }
            if (forwardIcon === undefined || forwardIcon === '') {
                forwardButton.innerHTML = '&#8635'
            } else {
                forwardButton.innerHTML = forwardIcon

            }
            forwardButton.addEventListener('click', () => {
                this.audio.currentTime += this.skipTime
                this.audio.play()
            })
        }

        let jumpButton = {}
        jumpButton.backwardButton = backwardButton
        jumpButton.forwardButton = forwardButton

        return jumpButton
    }

    prevNextButton ({ prev, prevIcon, prevFunc, next, nextIcon, nextFunc }) {
        let prevButton, nextButton
        let prevNextButton = {}
        if (prev) {
            prevButton = document.createElement('button')
            prevButton.className = 'prev-button'
            if (prevIcon === undefined || prevIcon === '') {
                prevButton.innerHTML = '&#8678'
            } else {
                prevButton.innerHTML = prevIcon
            }
            prevButton.addEventListener('click', () => {
                if (prevFunc !== undefined) {
                    prevFunc()
                }
            })
            prevNextButton.prevButton = prevButton
        }
        if (next) {
            nextButton = document.createElement('button')
            nextButton.className = 'next-button'
            if (nextIcon === undefined || nextIcon === '') {
                nextButton.innerHTML = '&#8680'
            } else {
                nextButton.innerHTML = nextIcon
            }
            nextButton.addEventListener('click', () => {
                if (nextFunc !== undefined) {
                    nextFunc()
                }
            })
            prevNextButton.nextButton = nextButton
        }

        return prevNextButton
    }

    volumeController ({ volumeIcon, muteIcon }) {
        let _volumeIcon = '&#9836'
        if (volumeIcon !== undefined && volumeIcon !== '') {
            _volumeIcon = volumeIcon
        }
        let _muteIcon = '&#9834'
        if (muteIcon !== undefined && muteIcon !== '') {
            _muteIcon = muteIcon
        }

        let progressBar = document.createElement('div')
        progressBar.className = 'progress-bar'

        let dot = document.createElement('command')
        dot.className = 'dot'
        dot.style.left = this.audio.volume * 100 + '%'

        progressBar.appendChild(dot)

        let audioButton = document.createElement('div')
        audioButton.className = 'audio-button'
        audioButton.innerHTML = _volumeIcon

        audioButton.addEventListener('click', () => {
            if (this.audio.muted) {
                this.audio.muted = false
                audioButton.innerHTML = _volumeIcon
            } else {
                this.audio.muted = true
                audioButton.innerHTML = _muteIcon
            }
        })

        mouseMoveVolumeDot(this.audio, dot, progressBar)
        mouseClickVolumeProgressBar(this.audio, dot, progressBar)

        let volumeController = {}
        volumeController.progressBar = progressBar
        // volumeController.dot = dot
        volumeController.audioButton = audioButton
        return volumeController
    }

    timer () {
        this.timerLoaded = true

        this.current = document.createElement('div')
        this.current.className = 'current'

        let duration = document.createElement('div')
        duration.className = 'duration'

        this.audio.addEventListener('loadeddata', () => {
            this.current.innerText = '00:00:00'
            duration.innerText = timeFormat(this.audio.duration)
        })

        let timer = {}
        timer.current = this.current
        timer.duration = duration
        return timer
    }

    timelineBuild ({ moveDotFunction, clickProcessbarFunction }) {
        timelineInit({
            audio: this.audio,
            timeline: this.timeline,
            moveDotFunction: moveDotFunction,
            clickProcessbarFunction: clickProcessbarFunction
        })
    }

    gallery ({ itemClass, activeClass }) {
        if (this.data === undefined || this.data === '') {
            console.error('no data!')
            return false
        }

        this.galleryLoaded = true

        if (itemClass === undefined || itemClass === '') {
            this.galleryItemClass = 'gallery-item'
        } else {
            this.galleryItemClass = _temClass
        }
        if (activeClass === undefined || activeClass === '') {
            this.galleryActiveClass = 'active'
        } else {
            this.galleryActiveClass = activeClass
        }

        let gallery = {}
        gallery.items = []

        for (let index = 0; index < this.data.length; index++) {
            let galleryItem = document.createElement('figure')
            galleryItem.className = this.galleryItemClass
            galleryItem.setAttribute('time-point', this.data[index].timePoint)

            let imgWrap = document.createElement('div')
            imgWrap.className = 'img-wrap'

            let img = document.createElement('div')
            img.className = 'img'

            let galleryImg = new Image()
            galleryImg.setAttribute('src', this.data[index].imgUrl)

            img.appendChild(galleryImg)
            imgWrap.appendChild(img)

            let contentWrap = document.createElement('div')
            contentWrap.className = 'content-wrap'

            let title = document.createElement('h3')
            title.className = 'title'
            title.innerText = this.data[index].title

            let content = document.createElement('div')
            content.className = 'content'
            content.innerText = this.data[index].context

            contentWrap.appendChild(title)
            contentWrap.appendChild(content)

            galleryItem.appendChild(imgWrap)
            galleryItem.appendChild(contentWrap)

            gallery.items.push(galleryItem)
        }

        // init gallery, default select first timepoint
        this.galleryItems = gallery.items
        this.galleryIndex = 0
        this.galleryItems[this.galleryIndex].classList.add(this.galleryActiveClass)

        return gallery  
    }

    tagLine ({ tagItemClass, progressDistance }) {
        if (this.data === undefined || this.data === '') {
            console.error('no data!')
            return false
        }

        this.tagLineLoaded = true

        if (tagItemClass === undefined || tagItemClass === '') {
            this.tagItemClass = 'item'
        } else {
            this.tagItemClass = tagItemClass
        }

        // default 1 ms = 1.6666666px
        if (progressDistance === undefined || progressDistance === 0) {
            this.progressDistance = 1.6666666666
        } else {
            this.progressDistance = progressDistance
        }

        let progressWrap = document.createElement('div')
        progressWrap.className = 'progress-wrap'

        this.progress = document.createElement('div')
        this.progress.className = 'progress'

        for (let index = 0; index < this.data.length; index++) {
            let item = document.createElement('figure')
            item.className = this.tagItemClass
            item.setAttribute('time-point', this.data[index].timePoint)
            item.setAttribute('style', 'left:' + this.data[index].timePoint * this.progressDistance + 'px')

            let timeLine = document.createElement('div')
            timeLine.className = 'time-line'

            let title = document.createElement('div')
            title.className = 'title'
            title.innerText = this.data[index].title

            let timeMark = document.createElement('div')
            timeMark.className = 'time-mark'
            timeMark.innerText = timeFormat(this.data[index].timePoint)

            item.appendChild(timeLine)
            item.appendChild(title)
            item.appendChild(timeMark)

            item.addEventListener('click', () => {
                this.audio.currentTime = this.data[index].timePoint
                this.audio.play()
            })

            this.progress.appendChild(item)
        }

        progressWrap.appendChild(this.progress)

        let timePointLine = document.createElement('div')
        timePointLine.className = 'time-point-line'

        let wrap = document.createElement('div')
        wrap.className = 'tag-line'
        wrap.appendChild(timePointLine)
        wrap.appendChild(progressWrap)

        tagLineDrag({
            tagLine: wrap,
            audio: this.audio,
            progressDistance: this.progressDistance,
            progress: this.progress
        })

        let tagLine = {}
        tagLine.timePointLine = timePointLine
        tagLine.progress = this.progress
        tagLine.wrap = wrap

        return tagLine
    }
}

