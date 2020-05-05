export const volumeInit = ({ audio, volumeIcon, muteIcon }) => {
    let _volumeIcon = '&#9836'
    if (volumeIcon !== undefined && volumeIcon !== '') {
        _volumeIcon = volumeIcon
    }
    let _muteIcon = '&#9834'
    if (muteIcon !== undefined && muteIcon !== '') {
        _muteIcon = muteIcon
    }

    let progressBar = document.createElement('div')
    progressBar.className = 'progress-bar'

    let dot = document.createElement('command')
    dot.className = 'dot'
    dot.style.left = audio.volume * 100 + '%'

    progressBar.appendChild(dot)

    let audioButton = document.createElement('div')
    audioButton.className = 'audio-button'
    audioButton.innerHTML = _volumeIcon

    audioButton.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false
            audioButton.innerHTML = _volumeIcon
        } else {
            audio.muted = true
            audioButton.innerHTML = _muteIcon
        }
    })

    mouseMoveVolumeDot(this.audio, dot, progressBar)
    mouseClickVolumeProgressBar(this.audio, dot, progressBar)

    let volumeController = {}
    volumeController.progressBar = progressBar
    // volumeController.dot = dot
    volumeController.audioButton = audioButton
    return volumeController
}

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
            let currentX = e.clientX - progressBar.getBoundingClientRect().left
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
        dot.style.left = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth * 100 + "%"
        audio.volume = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth
    })
}
