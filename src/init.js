import core from "./core.js"
import data from "./data.js"
import './styles/style.less'

export default class player {
    constructor({ id, updateTimer }) {
        if (id === undefined || id === '') {
            console.error('id id required!')
            return false
        }
        this.player = document.getElementById(id)

        // this.core = {}
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

    playButton () {
        this.playButton = this.core.playButton()
    }

    jumpButton () {
        this.jumpButton = this.core.jumpButton()
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
}
