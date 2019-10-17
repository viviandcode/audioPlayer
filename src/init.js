import core from "./core.js"

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

    playButton ({ playIcon, pauseIcon, className }) {
        this.playButton = this.core.playButton({ playIcon, pauseIcon, className })
        this.controller.appendChild(this.playButton)
    }

    jumpButton ({ jumpTime, backward, backwardClass, forward, forwardClass }) {
        this.jumpButton = this.core.jumpButton({ jumpTime, backward, backwardClass, forward, forwardClass })
        this.controller.insertBefore(this.jumpButton.backwardButton, this.playButton)
        this.controller.appendChild(this.jumpButton.forwardButton)
    }

    changeButton () {
        this.changeButton = this.core.changeButton()
    }

    volumeController () {
        this.volumeController = this.core.volumeController()
    }

    timer () {
        this.timer = this.core.timer()
    }

    timeline () {
        this.timeline = this.core.timeline()
    }

    gallery () {
        this.gallery = this.core.gallery()
    }

    tagLine () {
        this.tagLine = this.core.tagLine()
    }
}
