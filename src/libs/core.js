import { playButtonInit } from './playButton.js'
import { skipTimeButtonInit } from './skipTimeButton.js'
import { prevNextButtonInit } from './prevNextButton.js'
import { volumeInit } from './volume.js'
import { timerInit, timerPlayProcess } from './timer.js'
import { timelineInit, timelinePlayProcess } from './timeline.js'
import { galleryInit, galleryActive } from './gallery.js'
import { tagLineInit, tagLineProgress } from './tagLine.js'

export default class core {
    constructor({ src, updateTime }) {
        // declare a object, passing by referrence
        // init modules load status
        this.playButton = {}
        this.playButton.dom = {}

        this.timer = {}
        this.timer.loaded = false

        this.timeline = {}
        this.timeline.loaded = false
        this.timeline.dom = {}
        this.timeline.currentDot = {}
        this.timeline.currentDot.mouseDownStatus = false

        this.gallery = {}
        this.gallery.loaded = false
        
        this.tagLine = {}
        this.tagLine.loaded = false
        this.tagLine.dom = {}

        // create audio element
        this.audio = document.createElement('audio')
        this.audio.classList.add('audio')

        if (src !== undefined && src !== '') {
            this.audio.src = src
        }

        // updateTime, default step 20 millisecond
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

    data (data) {
        this.data = data
    }

    // monitor audio playing
    monitor () {
        let setIntervalObj
        this.audio.addEventListener('play', () => {
            // change play button icon
            this.playButton.dom.innerHTML = this.playButton.pauseIcon

            setIntervalObj = setInterval(() => {
                // update timer
                if (this.timer.loaded) {
                    timerPlayProcess({
                        audio: this.audio,
                        timer: this.timer
                    })
                }

                // update timeline dot postation
                if (this.timeline.loaded) {
                    timelinePlayProcess({
                        audio: this.audio,
                        dot: this.timeline.currentDot
                    })
                }

                // gallery seek active item
                if (this.gallery.loaded) {
                    galleryActive({
                        audio: this.audio,
                        gallery: this.gallery,
                        galleryItems: this.gallery.items,
                        itemClass: this.gallery.itemClass,
                        activeClass: this.gallery.activeClass,
                        galleryIndex: this.gallery.index
                    })
                }

                // tag line
                if (this.tagLine.loaded) {
                    tagLineProgress({
                        audio: this.audio,
                        tagLine: this.tagLine
                    })
                }
            }, this.updateTime)
        }, false)

        this.audio.addEventListener('pause', () => {
            this.playButton.dom.innerHTML = this.playButton.playIcon
            clearInterval(setIntervalObj)
        })
    }

    playButtonBuild ({ playIcon, pauseIcon, className }) {
        playButtonInit({
            audio: this.audio,
            playButton: this.playButton,
            playIcon: playIcon,
            pauseIcon: pauseIcon,
            className: className
        })
        return this.playButton
    }

    skipTimeButtonBuild ({ skipTime, backward, backwardClass, backwardIcon, forward, forwardClass, forwardIcon }) {
        return skipTimeButtonInit({
            audio: this.audio,
            skipTime: skipTime,
            backward: backward,
            backwardClass: backwardClass,
            backwardIcon: backwardIcon,
            forward: forward,
            forwardClass: forwardClass,
            forwardIcon: forwardIcon
        })
    }

    prevNextButtonBuild ({ prev, prevIcon, prevFunc, next, nextIcon, nextFunc }) {
        return prevNextButtonInit({
            prev: prev,
            prevIcon: prevIcon,
            prevFunc: prevFunc,
            next: next,
            nextIcon: nextIcon,
            nextFunc: nextFunc
        })
    }

    volumeBuild ({ volumeIcon, muteIcon }) {
        return volumeInit({
            audio: this.audio,
            volumeIcon: volumeIcon,
            muteIcon: muteIcon
        })
    }

    timerBuild () {
        timerInit ({
            audio: this.audio,
            timer: this.timer
        })
        return this.timer
    }

    timelineBuild ({ moveDotCustomFunction, clickProcessbarCustomFunction }) {
        timelineInit({
            audio: this.audio,
            timeline: this.timeline,
            moveDotFunction: moveDotCustomFunction,
            clickProcessbarFunction: clickProcessbarCustomFunction
        })
        return this.timeline
    }

    galleryBuild ({ itemClass, activeClass }) {
        galleryInit({
            data: this.data,
            gallery: this.gallery,
            itemClass: itemClass,
            activeClass: activeClass
        })
        return this.gallery
    }

    tagLineBuild ({ tagItemClass, progressDistance }) {
        tagLineInit({
            audio: this.audio,
            data: this.data,
            tagLine: this.tagLine,
            tagItemClass: tagItemClass,
            progressDistance: progressDistance
        })
        return this.tagLine
    }
}
