export const tagLineProgress = ({ audio, progressDistance, progress }) => {
    progress.setAttribute('style', 'transform: translateX(-'+ audio.currentTime * progressDistance +'px)')
}

export const tagLineDrag = ({ tagLine, audio, progressDistance, progress }) => {
    let mouseDownFlag = false
    let startX

    tagLine.addEventListener('mousedown', e => {
        mouseDownFlag = true
        startX = e.clientX
        audio.pause()
    })
    document.addEventListener('mouseup', e => {
        if (mouseDownFlag) {
            audio.play()
            mouseDownFlag = false
        }
    })
    document.addEventListener('mousemove', e => {
        if (mouseDownFlag) {
            let currentX = e.clientX
            // move distance slow down 100X
            let distance = (currentX - startX) / 100

            let timeOffset = - distance / progressDistance

            // update audio time
            audio.currentTime = audio.currentTime + timeOffset
            // update progress position
            progress.setAttribute('style', 'transform: translateX(-'+ audio.currentTime * progressDistance +'px);')
            // audio.play()
        }
    })
}