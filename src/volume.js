// mouse move dot
export const mouseMoveVolumeDot = (audio, dot, progressBar) => {
    let mouseDownFlag = false

    dot.addEventListener('mousedown', () => {
        mouseDownFlag = true
    })
    document.addEventListener('mouseup', () => {
        mouseDownFlag = false
    })
    document.addEventListener('mousemove', e => {
        if (mouseDownFlag) {
            let currentX = e.clientX - progressBar.offsetLeft
            let per = currentX / progressBar.offsetWidth

            if (currentX < 0) {
                dot.style.left = "0%"
            } else if (currentX > progressBar.offsetWidth) {
                dot.style.left = "100%"
            } else {
                dot.style.left = per * 100 + "%"
            }

            // update audio volume
            if (per < 0) {
                audio.volume = 0
            } else if (per > 1) {
                audio.volume = 1
            } else {
                audio.volume = per
            }
        }
    })
}

// mouse click progress bar
export const mouseClickVolumeProgressBar = (audio, dot, progressBar) => {
    progressBar.addEventListener('click', e => {
        dot.style.left = (e.clientX - progressBar.offsetLeft) / progressBar.offsetWidth * 100 + "%"
        audio.volume = (e.clientX - progressBar.offsetLeft) / progressBar.offsetWidth
    })
}
