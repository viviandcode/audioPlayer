import core from "./libs/core.js"

export default class player {
    constructor({ id, updateTimer }) {
        if (id === undefined || id === '') {
            console.error('id id required!')
            return false
        }
        this.player = document.getElementById(id)

        this.controller = document.createElement('div')
        this.controller.className = 'controller'
        this.player.appendChild(this.controller)

        this.playController = document.createElement('div')
        this.playController.className = 'play-controller'
        this.controller.appendChild(this.playController)

        this.timelineWrap = document.createElement('div')
        this.timelineWrap.className = 'timeline-wrap'
        this.player.appendChild(this.timelineWrap)

        if (updateTimer === undefined || updateTimer === 0) {
            console.error('updateTimer is required!')
            return false
        } else {
            this.core = new core({
                updateTimer: updateTimer
            })
        }
    }

    set src (src) {
        this.core.src = src
    }
    get src () {
        return this.core.src
    }

    data (data) {
        this.core.data(data)
    }

    gallery ({ itemClass, activeClass }) {
        this.gallery = this.core.gallery({ itemClass, activeClass })

        let galleryWrap = document.createElement('div')
        galleryWrap.className = 'gallery-wrap'

        this.gallery.items.forEach(item => {
            galleryWrap.appendChild(item)
        })

        this.player.insertBefore(galleryWrap, this.controller)
    }

    tagLine ({ tagItemClass, progressDistance }) {
        this.tagLine = this.core.tagLine({ tagItemClass, progressDistance })
        this.player.insertBefore(this.tagLine.wrap, this.controller)
    }

    customButton () {
        let custom = document.createElement('div')
        custom.className = 'custom'

        let icons = [
            '<i class="fa fa-thumbs-up" aria-hidden="true"></i><span>211</span>',
            '<i class="fa fa-comment" aria-hidden="true"></i><span>68</span>',
            '<i class="fa fa-bookmark" aria-hidden="true"></i><span>68</span>',
            '<i class="fa fa-share" aria-hidden="true"></i><span>Share</span>',
        ]
          
        for (let index = 0; index < icons.length; index++) {
            let button = document.createElement('a')
            button.className = 'button'
            button.innerHTML = icons[index]
            custom.append(button)
        }

        this.controller.insertBefore(custom, this.playController)
    }

    playButton ({ playIcon, pauseIcon, className }) {
        this.playButton = this.core.playButton({ playIcon, pauseIcon, className })
        this.playController.appendChild(this.playButton)
    }

    skipTimeButton ({ skipTime, backward, backwardClass, backwardIcon, forward, forwardClass, forwardIcon }) {
        this.skipTimeButton = this.core.skipTimeButton({ skipTime, backward, backwardClass, backwardIcon, forward, forwardClass, forwardIcon })
        this.playController.insertBefore(this.skipTimeButton.backwardButton, this.playButton)
        this.playController.appendChild(this.skipTimeButton.forwardButton)
    }

    prevNextButton ({ prev, prevIcon, prevFunc, next, nextIcon, nextFunc }) {
        this.prevNextButton = this.core.prevNextButton({ prev, prevIcon, prevFunc, next, nextIcon, nextFunc })
        this.playController.insertBefore(this.prevNextButton.prevButton, this.skipTimeButton.backwardButton)
        this.playController.appendChild(this.prevNextButton.nextButton)
    }

    volumeController ({ volumeIcon, muteIcon }) {
        this.volumeController = this.core.volumeController({ volumeIcon, muteIcon })
        let volumeWrap = document.createElement('div')
        volumeWrap.className = 'volume'
        volumeWrap.appendChild(this.volumeController.audioButton)
        volumeWrap.appendChild(this.volumeController.progressBar)
        this.controller.appendChild(volumeWrap)
    }

    timer () {
        this.timer = this.core.timer()
        this.timelineWrap.appendChild(this.timer.current)
        this.timelineWrap.appendChild(this.timer.duration)
    }

    timeline ({ dotFunction, progressFunction }) {
        this.timeline = this.core.timeline({ dotFunction, progressFunction })
        let timeline = document.createElement('div')
        timeline.className = 'timeline'
        timeline.appendChild(this.timeline.progressBar)
        this.timelineWrap.insertBefore(timeline, this.timer.duration)
    }
}
