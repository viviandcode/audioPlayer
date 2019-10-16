import { timeFormat } from './utils/timeFormat.js'
import { mouseMoveDot, mouseClickProgressBar } from './timeline.js'
import { galleryActive } from './gallery.js'
import { tagLineProgress, tagLineDrag } from './tagLine.js'
import { mouseMoveVolumeDot, mouseClickVolumeProgressBar } from './volume.js'

export default class core {
    constructor({ src, updateTime }) {
        // load flag
        this.timerLoad = false
        this.timelineLoad = false
        this.galleryLoad = false
        this.tagLineLoad = false


        // audio element
        this.audio = document.createElement('audio')
        this.audio.classList.add('audio')

        if (src !== undefined && src !== '') {
            this.audio.src = src
        }

        // updateTime default 20 millisecond
        if (updateTime !== undefined && updateTime !== 0) {
            this.updateTime = updateTime
        } else {
            this.updateTime = 20
        }

        this.watchPlay()
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

    // watch audio playing
    watchPlay () {
        let setIntervalObj
        this.audio.addEventListener('play', () => {
            // shift icon
            this.playButton.innerHTML = this.pauseIcon

            setIntervalObj = setInterval(() => {
                // update timer
                if (this.timerLoad) {
                    this.current.innerText = timeFormat(this.audio.currentTime)
                }

                // update dot postation
                if (this.timelineLoad) {
                    let progressPer = this.audio.currentTime / this.audio.duration
                    if (progressPer <= 1) {
                        this.dot.style.left = progressPer * 100 + '%'
                    } else {
                        this.dot.style.left = '100%'
                    }
                }

                // gallery seek active item
                if (this.galleryLoad) {
                    galleryActive({
                        audio: this.audio,
                        gallerySelectIndex: this.gallerySelectIndex,
                        gallerySelectTimePoint: this.gallerySelectTimePoint,
                        // galleryItems: this.gallery.children,
                        galleryItems: this.galleryItems,
                        itemClass: this.galleryItemClass,
                        activeClass: this.galleryActiveClass
                    })
                }

                // tag line
                if (this.tagLineLoad) {
                    tagLineProgress({
                        audio: this.audio,
                        progressDistance: this.progressDistance,
                        progress: this.progress
                    })
                }
            }, this.updateTime)
        })

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

    jumpButton ({ jumpTime, backward, backwardClass, forward, forwardClass }) {
        let backwardButton, forwardButton

        if (jumpTime === undefined && jumpTime === 0) {
            this.jumpTime = 15
        } else {
            this.jumpTime = jumpTime
        }

        if (backward) {
            backwardButton = document.createElement('button')
            if (backwardClass === undefined || backwardClass === '') {
                backwardButton.className = 'backward-button'
            } else {
                backwardButton.className = backwardClass
            }
            backwardButton.innerHTML = '&#8634'
            backwardButton.addEventListener('click', () => {
                this.audio.currentTime -= this.jumpTime
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
            forwardButton.innerHTML = '&#8635'
            forwardButton.addEventListener('click', () => {
                this.audio.currentTime += this.jumpTime
                this.audio.play()
            })
        }

        let jumpButton = {}
        jumpButton.backwardButton = backwardButton
        jumpButton.forwardButton = forwardButton

        return jumpButton
    }

    changeButton ({ prev, prevIcon, prevFunc, next, nextIcon, nextFunc }) {
        let prevButton, nextButton
        let changeButton = {}
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
            changeButton.prevButton = prevButton
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
            changeButton.nextButton = nextButton
        }

        return changeButton
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

        // let progressWrap = document.createElement('div')
        // progressWrap.className = 'progress-wrap'

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
        this.timerLoad = true

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
        timer.duration = this.duration
        return timer
    }

    timeline ({ dotFunction, progressFunction }) {
        this.timelineLoad = true

        // let timeline = document.createElement('div')
        // timeline.className = 'timeline'

        let progressBar = document.createElement('div')
        progressBar.className = 'progress-bar'

        this.dot = document.createElement('command')
        this.dot.className = 'dot'

        if (dotFunction === undefined) {
            mouseMoveDot(this.audio, this.dot, progressBar)
        } else {
            dotFunction(this.audio, this.dot, progressBar)
        }

        if (progressFunction === undefined) {
            mouseClickProgressBar(this.audio, this.dot, progressBar)
        } else {
            progressFunction(this.audio, this.dot, progressBar)
        }

        progressBar.appendChild(this.dot)

        let timeline = {}
        timeline.progressBar = progressBar
        // timeline.dot = this.dot
        return timeline
    }

    gallery ({ itemClass, activeClass }) {
        if (this.data === undefined || this.data === '') {
            console.error('no data!')
            return false
        }

        this.galleryLoad = true

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
        
        // let gallery = document.createElement('div')
        // gallery.className = 'gallery-wrap'

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
            galleryItem.appendChild(contextWrap)

            // gallery.appendChild(galleryItem)
            gallery.items.push(galleryItem)
        }

        // init gallery, default select first timepoint
        // let galleryItems = this.gallery.children
        this.galleryItems = gallery.items
        this.gallerySelectIndex = 0
        this.gallerySelectTimePoint = galleryItems[this.gallerySelectIndex].getAttribute('time-point')
        this.galleryItems[this.gallerySelectIndex].classList.add(this.galleryActiveClass)

        return gallery  
    }

    tagLine ({ tagItemClass, progressDistance }) {
        if (this.data === undefined || this.data === '') {
            console.error('no data!')
            return false
        }

        this.tagLineLoad = true

        if (tagItemClass === undefined || tagItemClass === '') {
            this.tagItemClass = 'tag-line-item'
        } else {
            this.tagItemClass = tagItemClass
        }

        // default 1 ms = 1.6666666px
        if (progressDistance === undefined || progressDistance === 0) {
            this.progressDistance = 1.6666666666
        } else {
            this.progressDistance = progressDistance
        }

        // let tagLine = document.createElement('div')
        // tagLine.className = 'tag-line'

        let wrap = document.createElement('div')
        wrap.className = 'tag-line-wrap'

        this.progress = document.createElement('div')
        this.progress.className = 'tag-line-progress'

        for (let index = 0; index < this.data.length; index++) {
            let item = document.createElement('figure')
            item.className = this.tagItemClass
            item.setAttribute('time-point', this.data[index].timePoint)
            item.setAttribute('style', 'left:' + this.data[index].timePoint * this.progressDistance + 'px')

            let timeLine = document.createElement('div')
            timeLine.className = 'time-line'

            let title = document.createElement('div')
            title.innerText = this.data[index].title

            let timeMark = document.createElement('div')
            timeMark.className = 'time-mark'
            timeMark.innerText = timeFormat(this.data[index].timePoint)

            item.appendChild(line)
            item.appendChild(title)
            item.appendChild(timeMark)

            item.addEventListener('click', () => {
                this.audio.currentTime = this.data[index].timePoint
                this.audio.play()
            })

            this.progress.appendChild(item)
        }

        wrap.appendChild(this.progress)

        let timePointLine = document.createElement('div')
        timePointLine.className = 'time-point-line'

        tagLineDrag({
            tagLine: this.tagLine,
            audio: this.audio,
            progressDistance: this.progressDistance,
            progress: this.progress
        })

        // return this.progress
    }
}

