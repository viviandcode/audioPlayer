// mouse move dot
export const mouseMoveDot = (audio, dot, progressBarObj) => {
    let mouseDownFlag = false

    dot.addEventListener('mousedown', () => {
        mouseDownFlag = true
    })
    document.addEventListener('mouseup', () => {
        mouseDownFlag = false
    })
    document.addEventListener('mousemove', e => {
        if (mouseDownFlag) {
            let currentX = e.clientX
            let progressBarWidth = progressBarObj.offsetWidth
            if (currentX < 0) {
                dot.style.left = "0%"
            } else if (currentX > progressBarWidth) {
                dot.style.left = "100%"
            } else {
                dot.style.left = currentX / progressBarWidth * 100 + "%"
            }

            // update audio play time
            audio.currentTime = currentX / progressBarWidth * audio.duration
            audio.play()
        }
    })
}

// mouse click progress bar
export const mouseClickProgressBar = (audio, dot, progressBarObj) => {
    progressBarObj.addEventListener('click', e => {
        dot.style.left = e.clientX / progressBarObj.offsetWidth * 100 + "%"
        audio.currentTime = e.clientX / progressBarObj.offsetWidth * audio.duration
        audio.play()
    })
}
