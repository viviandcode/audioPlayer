// audio playing process
export const timelinePlayProcess = ({ audio, dot }) => {
    if (!dot.status) {
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
        dot.status = true
    })
    document.addEventListener('mouseup', () => {
        if (dot.status) {
            audio.currentTime = precessPer * audio.duration
            audio.play()
            dot.status = false

        }
    })
    document.addEventListener('mousemove', e => {
        if (dot.status) {
            dot.status = true

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
