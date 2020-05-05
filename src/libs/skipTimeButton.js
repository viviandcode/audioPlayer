export const skipTimeButtonInit = ({ audio, skipTime, backward, backwardClass, backwardIcon, forward, forwardClass, forwardIcon }) => {
    let backwardButton, forwardButton

    if (skipTime === undefined || skipTime === 0) {
        skipTime = 15
    }

    if (backward) {
        backwardButton = document.createElement('button')
        if (backwardClass === undefined || backwardClass === '') {
            backwardButton.className = 'backward-button'
        } else {
            backwardButton.className = backwardClass
        }
        if (backwardIcon === undefined || backwardIcon === '') {
            backwardButton.innerHTML = '&#8634'
        } else {
            backwardButton.innerHTML = backwardIcon
        }
        backwardButton.addEventListener('click', () => {
            audio.currentTime -= skipTime
            audio.play()
        })
    }

    if (forward) {
        forwardButton = document.createElement('button')
        if (forwardClass === undefined || forwardClass === '') {
            forwardButton.className = 'forward-button'
        } else {
            forwardButton.className = forwardClass
        }
        if (forwardIcon === undefined || forwardIcon === '') {
            forwardButton.innerHTML = '&#8635'
        } else {
            forwardButton.innerHTML = forwardIcon

        }
        forwardButton.addEventListener('click', () => {
            audio.currentTime += skipTime
            audio.play()
        })
    }

    let jumpButton = {}
    jumpButton.backwardButton = backwardButton
    jumpButton.forwardButton = forwardButton

    return jumpButton
}