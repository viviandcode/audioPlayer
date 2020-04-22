import podcastPlayer from "./core.js"

export default class podcastPlayer {
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

        // div for gallery
        this.stage = document.createElement('div')
        this.stage.id = 'stage'
        this.player.appendChild(this.stage)

        // div for controllers
        this.controllers = document.createElement('div')
        this.controllers.id = 'controllers'
        this.player.appendChild(this.controllers)

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

    // buttons
    buttons ({ mode, playIcon, pauseIcon, forwardStep, backward, backwardIcon, forward, forwardIcon, prev, prevIcon, prevFunc, next, nextIcon, nextFunc, customButtons }) {
        // play button, deafult
        this.playIcon = '&#9658'
        if (playIcon !== undefined && playIcon !== '') {
            this.playIcon = playIcon
        }
        this.pauseIcon = '&Iota;&Iota;'
        if (pauseIcon !== undefined && pauseIcon !== '') {
            this.pauseIcon = pauseIcon
        }

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

        // backward / forward
        let backwardButton, forwardButton
        if (forwardStep !== undefined && forwardStep !== 0) {
            this.forwardStep = forwardStep
        } else {
            this.forwardStep = 15
        }
        if (backward) {
            if (backwardIcon === undefined || backwardIcon === '') {
                backwardIcon = '&#8634'
            }
            backwardButton = document.createElement('div')
            backwardButton.className = 'backward'
            backwardButton.innerHTML = backwardIcon
            backwardButton.addEventListener('click', () => {
                this.audio.currentTime -= this.forwardStep
                this.audio.play()
            })
        }
        if (forward) {
            if (forwardIcon === undefined || forwardIcon === '') {
                forwardIcon = '&#8635'
            }
            forwardButton = document.createElement('div')
            forwardButton.className = 'forward'
            forwardButton.innerHTML = forwardIcon
            forwardButton.addEventListener('click', () => {
                this.audio.currentTime += this.forwardStep
                this.audio.play()
            })
        }

        // prev button / next button
        let prevButton, nextButton
        if (prev) {
            if (prevIcon === undefined || prevIcon === '') {
                prevIcon = '&#8678'
            }
            prevButton = document.createElement('div')
            prevButton.className = 'prev'
            prevButton.innerHTML = prevIcon
            prevButton.addEventListener('click', () => {
                if (prevFunc !== undefined) {
                    prevFunc()
                }
            })
        }
        if (next) {
            if (nextIcon === undefined || nextIcon === '') {
                nextIcon = '&#8680'
            }
            nextButton = document.createElement('div')
            nextButton.className = 'next'
            nextButton.innerHTML = nextIcon
            nextButton.addEventListener('click', () => {
                if (nextFunc !== undefined) {
                    nextFunc()
                }
            })
        }

        if (mode === undefined || mode !== 'render') {
            // return object
            this.buttons = {}
            this.buttons.playButton =  this.playButton
            if (backward) {
                this.buttons.backwardButton = backwardButton
            }
            if (forward) {
                this.buttons.forwardButton = forwardButton
            }
            if (prev) {
                this.buttons.prevButton = prevButton
            }
            if (next) {
                this.buttons.nextButton = nextButton
            }
            return this.buttons
        } else {
            // render html
            this.buttons = document.createElement('div')
            this.buttons.className = 'buttons'

            let wrap = document.createElement('div')
            wrap.className = 'play-buttons'

            if (customButtons !== undefined) {
                let _custom = this.customButtons({ customButtons: customButtons })
                // this.buttons.appendChild()
                this.buttons.appendChild(_custom)
            }

            wrap.appendChild(this.playButton)
            if (prev) {
                wrap.insertBefore(prevButton, this.playButton)
            }
            if (backward) {
                wrap.insertBefore(backwardButton, this.playButton)
            }
            if (forward) {
                wrap.appendChild(forwardButton)
            }
            if (next) {
                wrap.appendChild(nextButton)
            }

            this.buttons.appendChild(wrap)
            this.controllers.appendChild(this.buttons)
        }
    }

    customButtons ({ customButtons }) {
        let wrap = document.createElement('div')
        wrap.className = 'custom-buttons'
        wrap.appendChild(customButtons)

        return wrap
    }

    volumeController ({ mode, volumeIcon, muteIcon }) {
        let _volumeIcon = '&#9836'
        if (volumeIcon !== undefined && volumeIcon !== '') {
            _volumeIcon = volumeIcon
        }
        let _muteIcon = '&#9834'
        if (muteIcon !== undefined && muteIcon !== '') {
            _muteIcon = muteIcon
        }

        let progress = document.createElement('div')
        progress.className = 'progress-wrap'

        let progressBar = document.createElement('div')
        progressBar.className = 'progress-bar'

        let dot = document.createElement('command')
        dot.className = 'dot'
        dot.style.left = this.audio.volume * 100 + '%'

        let muteButton = document.createElement('div')
        muteButton.className = 'mute'
        muteButton.innerHTML = _volumeIcon

        muteButton.addEventListener('click', () => {
            if (this.audio.muted) {
                this.audio.muted = false
                muteButton.innerHTML = _volumeIcon
            } else {
                this.audio.muted = true
                muteButton.innerHTML = _muteIcon
            }
        })

        mouseMoveVolumeDot(this.audio, dot, progressBar)
        mouseClickVolumeProgressBar(this.audio, dot, progressBar)

        if (mode === undefined || mode !== 'render') {
            this.volumeBox = {}
            this.volumeBox.progressBar = progressBar
            this.volumeBox.dot = dot
            this.volumeBox.muteButton = muteButton
            return this.volumeBox
        } else {
            this.volumeBox = document.createElement('div')
            this.volumeBox.className = 'volume'

            let wrap = document.createElement('div')
            wrap.className = 'wrap'

            progressBar.appendChild(dot)
            progress.appendChild(progressBar)
            this.volumeBox.appendChild(wrap)
            wrap.appendChild(muteButton)
            wrap.appendChild(progress)

            this.buttons.append(this.volumeBox)
        }
    }

    timer ({ mode }) {
        this.timerLoad = true

        this.timer = document.createElement('div')
        this.timer.className = 'timer'

        // add to {this} for class to change
        this.current = document.createElement('div')
        this.current.className = 'current'

        this.duration = document.createElement('div')
        this.duration.className = 'duration'

        this.audio.addEventListener('loadeddata', () => {
            this.current.innerText = '00:00:00'
            this.duration.innerText = timeFormat(this.audio.duration)
        })

        if (mode === undefined || mode !== 'render') {
            this.timer = {}
            this.timer.current = this.current
            this.timer.duration = this.duration

            return this.timer
        } else {
            this.timer.appendChild(this.current)
            this.timer.appendChild(this.duration)
            this.controllers.appendChild(this.timer)
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
            progressBar.appendChild(this.dot)
            this.timeline.appendChild(progressBar)
            this.timer.insertBefore(this.timeline, this.duration)
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

            let imgWrap = document.createElement('div')
            imgWrap.className = 'img-wrap'

            let img = document.createElement('div')
            img.className = 'img'

            let galleryImg = new Image()
            galleryImg.setAttribute('src', this.data[index].imgUrl)

            img.appendChild(galleryImg)
            imgWrap.appendChild(img)

            let contextWrap = document.createElement('div')
            contextWrap.className = 'context-wrap'

            let title = document.createElement('h3')
            title.className = 'title'
            title.innerText = this.data[index].title

            let context = document.createElement('div')
            context.className = 'context'
            context.innerText = this.data[index].context

            contextWrap.appendChild(title)
            contextWrap.appendChild(context)

            galleryItem.appendChild(imgWrap)
            galleryItem.appendChild(contextWrap)
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
            this.stage.appendChild(this.gallery)
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

            let line = document.createElement('div')
            line.className = 'line'

            let title = document.createElement('div')
            title.innerText = this.data[index].title

            // time mark
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

        if (mode === undefined || mode !== 'render') {
            return this.progress
        } else {
            wrap.appendChild(this.progress)

            let midLine = document.createElement('div')
            midLine.className = 'mid-line'
    
            this.tagLine.appendChild(midLine)
            this.tagLine.appendChild(wrap)
    
            this.controllers.appendChild(this.tagLine)
        }

        tagLineDrag({
            tagLine: this.tagLine,
            audio: this.audio,
            progressDistance: this.progressDistance,
            progress: this.progress
        })
    }
}

