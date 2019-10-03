import { timeFormat } from './utils.js'
import { mouseMoveDot, mouseClickProgressBar } from './timeline.js'
import { galleryActive } from './gallery.js'
import { tagLineProgress, tagLineDrag } from './tagLine.js'

export default class player {
    constructor({ id, src, updateTimer, loop }) {
        // load flag
        this.timerLoad = false
        this.timelineLoad = false
        this.galleryLoad = false
        this.tagLineLoad = false

        if (id === undefined || id === '') {
            console.error('Need id!')
            return false
        }
        this.player = document.getElementById(id)

        // audio element
        this.audio = document.createElement('audio')
        this.audio.classList.add('audio')

        if (src !== undefined && src !== '') {
            this.audio.src = src
        }

        // updateTimer default 20 millisecond
        if (updateTimer !== undefined && updateTimer !== 0) {
            this.updateStep = updateTimer
        } else {
            this.updateStep = 20
        }

        if (loop !== undefined && loop === true) {
            this.audio.loop = true
        } else {
            this.audio.loop = false
        }

        this.player.appendChild(this.audio)

        this.watchPlay()
    }

    // src shortcut
    set src (src) {
        this.audio.src = src
    }
    get src () {
        return this.audio.src
    }

    // loop shortcut
    set loop (loop) {
        if (loop === true) {
            this.audio.loop = true
        }
    }
    get loop () {
        return this.audio.loop
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
                        galleryItems: this.gallery.children,
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
            }, this.updateStep)
        })

        this.audio.addEventListener('pause', () => {
            this.playButton.innerHTML = this.playIcon
            clearInterval(setIntervalObj)
        })
    }

    // controller buttons
    controllers ({ playIcon, pauseIcon, forwardStep, backward, backwardIcon, forward, forwardIcon, mode }) {
        // play button, deafult
        this.playIcon = '&#9658'
        this.pauseIcon = '&Iota;&Iota;'
        if (playIcon !== undefined && playIcon !== '') {
            this.playIcon = playIcon
        }
        if (pauseIcon !== undefined && pauseIcon !== '') {
            this.pauseIcon = pauseIcon
        }

        // backward button
        if (backward && backwardIcon === undefined || backwardIcon === '') {
            backwardIcon = '&#8634'
        }

        // forward button
        if (forward && forwardIcon === undefined || forwardIcon === '') {
            forwardIcon = '&#8635'
        }

        let wrap = document.createElement('div')
        wrap.className = 'controllers'

        // add to {this} for class to change
        this.playButton = document.createElement('div')
        this.playButton.className = 'play'
        this.playButton.innerHTML = this.playIcon
        this.playButton.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play()
            } else {
                this.audio.pause()
            }
        })

        if (forwardStep !== undefined && forwardStep !== 0) {
            this.forwardStep = forwardStep
        } else {
            this.forwardStep = 15
        }

        let backwardButton, forwardButton
        if (backward) {
            backwardButton = document.createElement('div')
            backwardButton.className = 'backward'
            backwardButton.innerHTML = backwardIcon
            backwardButton.addEventListener('click', () => {
                this.audio.currentTime -= this.forwardStep
                this.audio.play()
            })
        }

        if (forward) {
            forwardButton = document.createElement('div')
            forwardButton.className = 'forward'
            forwardButton.innerHTML = forwardIcon
            forwardButton.addEventListener('click', () => {
                this.audio.currentTime += this.forwardStep
                this.audio.play()
            })
        }

        if (mode === undefined || mode !== 'render') {
            // return object
            this.controllers = {}
            this.controllers.playButton =  this.playButton
            if (backward) {
                this.controllers.backwardButton = backwardButton
            }
            if (forward) {
                this.controllers.forwardButton = forwardButton
            }
            return this.controllers
        } else {
            // render html
            wrap.appendChild(this.playButton)
            if (backward) {
                wrap.insertBefore(backwardButton, this.playButton)
            }

            if (forward) {
                wrap.appendChild(forwardButton)
            }
            this.player.appendChild(wrap)
        }
    }

    timer ({ mode }) {
        this.timerLoad = true

        let timer = document.createElement('div')
        timer.className = 'timer'

        // add to {this} for class to change
        this.current = document.createElement('div')
        this.current.className = 'current'

        let duration = document.createElement('div')
        duration.className = 'duration'

        this.audio.addEventListener('loadeddata', () => {
            this.current.innerText = '00:00:00'
            duration.innerText = timeFormat(this.audio.duration)
        })

        if (mode === undefined || mode !== 'render') {
            this.timer = {}
            this.timer.current = this.current
            this.timer.duration = duration

            return this.timer
        } else {
            timer.appendChild(this.current)
            timer.appendChild(duration)
            this.player.appendChild(timer)
        }
    }

    timeline ({ mode, dotFunction, progressFunction }) {
        this.timelineLoad = true

        this.timeline = document.createElement('div')
        this.timeline.className = 'timeline'

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

        if (mode === undefined || mode !== 'render') {
            this.timeline = {}
            this.timeline.progressBar = progressBar
            this.timeline.dot = this.dot
            return this.timeline
        } else {
            this.timeline.appendChild(progressBar)
            this.timeline.appendChild(this.dot)
            this.player.appendChild(this.timeline)
        }
    }

    gallery ({ mode, itemClass, activeClass }) {
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
        
        this.gallery = document.createElement('div')
        this.gallery.className = 'gallery-wrap'

        for (let index = 0; index < this.data.length; index++) {
            let galleryItem = document.createElement('figure')
            galleryItem.className = this.galleryItemClass
            galleryItem.setAttribute('time-point', this.data[index].timePoint)

            let galleryImg = new Image()
            galleryImg.setAttribute('src', this.data[index].imgUrl)

            galleryItem.appendChild(galleryImg)
            this.gallery.appendChild(galleryItem)
        }

        // init gallery, default select first timepoint
        let galleryItems = this.gallery.children
        this.gallerySelectIndex = 0
        this.gallerySelectTimePoint = galleryItems[this.gallerySelectIndex].getAttribute('time-point')
        galleryItems[this.gallerySelectIndex].classList.add(this.galleryActiveClass)

        if (mode === undefined || mode !== 'render') {
            return this.gallery
        } else {
            this.player.appendChild(this.gallery)
        }
    }

    // html structure:
    // div.short-cuts
    //   div.short-cuts-wrap
    //     div.short-cuts-progress
    //       div.short-cut-item ...
    tagLine ({ mode, tagItemClass, progressDistance }) {
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

        this.tagLine = document.createElement('div')
        this.tagLine.className = 'tag-line'

        let wrap = document.createElement('div')
        wrap.className = 'tag-line-wrap'

        this.progress = document.createElement('div')
        this.progress.className = 'tag-line-progress'

        for (let index = 0; index < this.data.length; index++) {
            let item = document.createElement('figure')
            item.className = this.tagItemClass
            item.setAttribute('time-point', this.data[index].timePoint)
            item.setAttribute('style', 'left:' + this.data[index].timePoint * this.progressDistance + 'px')

            let title = document.createElement('div')
            title.innerText = this.data[index].title

            item.appendChild(title)

            item.addEventListener('click', () => {
                this.audio.currentTime = this.data[index].timePoint
                this.audio.play()
            })

            this.progress.appendChild(item)
        }

        if (mode === undefined || mode !== 'render') {
            return this.progress
        } else {
            wrap.appendChild(this.progress)

            let midLine = document.createElement('div')
            midLine.className = 'mid-line'
    
            this.tagLine.appendChild(midLine)
            this.tagLine.appendChild(wrap)
    
            this.player.appendChild(this.tagLine)
        }

        tagLineDrag({
            tagLine: this.tagLine,
            audio: this.audio,
            progressDistance: this.progressDistance,
            progress: this.progress
        })
    }
    
    volume () {
        
    }
}

