// playing
export const timelinePlayProcess = (audio, dot, dotDragStatus) => {
    if (!dotDragStatus.status) {
        let progressPer = audio.currentTime / audio.duration
        if (progressPer <= 1) {
            dot.style.left = progressPer * 100 + '%'
        } else {
            dot.style.left = '100%'
        }
    }
}

// mouse move timeline dot
export const mouseMoveTimelineDot = (audio, dot, progressBar, dotDragStatus) => {
    let mouseDownStatus = false
    let precessPer = 0
    dot.addEventListener('mousedown', () => {
        mouseDownStatus = true
        dotDragStatus.status = true

        // audio.pause()
    })
    document.addEventListener('mouseup', () => {
        if (mouseDownStatus) {
            console.log('1')
            audio.currentTime = precessPer * audio.duration
            audio.play()
            mouseDownStatus = false
            dotDragStatus.status = false

        }
    })
    document.addEventListener('mousemove', e => {
        if (mouseDownStatus) {
            dotDragStatus.status = true

            let currentX = e.clientX - progressBar.getBoundingClientRect().left
            let per = currentX / progressBar.offsetWidth

            if (currentX < 0) {
                dot.style.left = "0%"
            } else if (currentX > progressBar.offsetWidth) {
                dot.style.left = "100%"
            } else {
                dot.style.left = per * 100 + "%"
            }

            // update audio play time
            // audio.currentTime = per * audio.duration
            // audio.play()

            precessPer = per
        }
    })
}

// mouse click progress bar
export const mouseClickProgressBar = (audio, dot, progressBar) => {
    progressBar.addEventListener('click', e => {
        dot.style.left = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth * 100 + "%"
        audio.currentTime = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth * audio.duration
        audio.play()
    })
}
