// structure timeline element
export const timeline = ({ moveDotFunction, clickProcessbarFunction }) => {
    this.timelineLoaded = true

    let progressBar = document.createElement('div')
    progressBar.className = 'progress-bar'

    this.timelineCurrentDot.dom = document.createElement('command')
    this.timelineCurrentDot.dom.className = 'dot'

    if (moveDotFunction === undefined) {
        mouseMoveTimelineDot({
            audio: this.audio,
            dot: this.timelineCurrentDot,
            progressBar: progressBar
        })
    } else {
        moveDotFunction({
            audio: this.audio,
            dot: this.timelineCurrentDot,
            progressBar: progressBar
        })
    }

    if (clickProcessbarFunction === undefined) {
        mouseClickProgressBar({
            audio: this.audio,
            dot: this.timelineCurrentDot,
            progressBar: progressBar
        })
    } else {
        clickProcessbarFunction({
            audio: this.audio,
            dot: this.timelineCurrentDot,
            progressBar: progressBar
        })
    }

    progressBar.appendChild(this.timelineCurrentDot.dom)

    let timeline = {}
    timeline.progressBar = progressBar
    return timeline
}

// audio playing process
export const timelinePlayProcess = ({ audio, dot }) => {
    if (!dot.mouseDownStatus) {
        let progressPer = audio.currentTime / audio.duration
        if (progressPer <= 1) {
            dot.dom.style.left = progressPer * 100 + '%'
        } else {
            dot.dom.style.left = '100%'
        }
    }
}

// mouse move timeline dot
export const mouseMoveTimelineDot = ({ audio, dot, progressBar }) => {
    let precessPer = 0
    dot.dom.addEventListener('mousedown', () => {
        dot.mouseDownStatus = true
    })
    document.addEventListener('mouseup', () => {
        if (dot.mouseDownStatus) {
            audio.currentTime = precessPer * audio.duration
            audio.play()
            dot.mouseDownStatus = false

        }
    })
    document.addEventListener('mousemove', e => {
        if (dot.mouseDownStatus) {
            dot.mouseDownStatus = true

            let currentX = e.clientX - progressBar.getBoundingClientRect().left
            precessPer = currentX / progressBar.offsetWidth

            if (currentX < 0) {
                dot.dom.style.left = "0%"
            } else if (currentX > progressBar.offsetWidth) {
                dot.dom.style.left = "100%"
            } else {
                dot.dom.style.left = precessPer * 100 + "%"
            }
        }
    })
}

// mouse click progress bar
export const mouseClickProgressBar = ({ audio, dot, progressBar }) => {
    progressBar.addEventListener('click', e => {
        dot.dom.style.left = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth * 100 + "%"
        audio.currentTime = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth * audio.duration
        audio.play()
    })
}
