// init timeline structure
export const timelineInit = ({ audio, timeline, moveDotFunction, clickProcessbarFunction }) => {
    timeline.loaded = true

    let progressBar = document.createElement('div')
    progressBar.className = 'progress-bar'

    timeline.currentDot.dom = document.createElement('command')
    timeline.currentDot.dom.className = 'dot'

    if (moveDotFunction === undefined) {
        mouseMoveTimelineDot({
            audio: audio,
            dot: timeline.currentDot,
            progressBar: progressBar
        })
    } else {
        moveDotFunction({
            audio: audio,
            dot: timeline.currentDot,
            progressBar: progressBar
        })
    }

    if (clickProcessbarFunction === undefined) {
        mouseClickProgressBar({
            audio: audio,
            dot: timeline.currentDot,
            progressBar: progressBar
        })
    } else {
        clickProcessbarFunction({
            audio: audio,
            dot: timeline.currentDot,
            progressBar: progressBar
        })
    }

    progressBar.appendChild(timeline.currentDot.dom)
    timeline.dom.progressBar = progressBar
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
