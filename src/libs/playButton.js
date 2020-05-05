export const playButtonInit = ({ audio, playButton, playIcon, pauseIcon, className }) => {
    if (playIcon === undefined || playIcon === '') {
        playButton.playIcon = '&#9658'
    } else {
        playButton.playIcon = playIcon
    }

    if (pauseIcon === undefined || pauseIcon === '') {
        playButton.pauseIcon = '&Iota;&Iota;'
    } else {
        playButton.pauseIcon = pauseIcon
    }

    playButton.dom = document.createElement('button')
    if (className === undefined || className === '') {
        playButton.dom.className = 'play-button'
    } else {
        playButton.dom.className = className
    }
    playButton.dom.innerHTML = playIcon
    playButton.dom.addEventListener('click', () => {
        if (audio.paused) {
            audio.play()
        } else {
            audio.pause()
        }
    })
}