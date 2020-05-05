export const prevNextButtonInit = ({ prev, prevIcon, prevFunc, next, nextIcon, nextFunc }) => {
    let prevButton, nextButton
    let prevNextButton = {}
    if (prev) {
        prevButton = document.createElement('button')
        prevButton.className = 'prev-button'
        if (prevIcon === undefined || prevIcon === '') {
            prevButton.innerHTML = '&#8678'
        } else {
            prevButton.innerHTML = prevIcon
        }
        prevButton.addEventListener('click', () => {
            if (prevFunc !== undefined) {
                prevFunc()
            }
        })
        prevNextButton.prevButton = prevButton
    }
    if (next) {
        nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        if (nextIcon === undefined || nextIcon === '') {
            nextButton.innerHTML = '&#8680'
        } else {
            nextButton.innerHTML = nextIcon
        }
        nextButton.addEventListener('click', () => {
            if (nextFunc !== undefined) {
                nextFunc()
            }
        })
        prevNextButton.nextButton = nextButton
    }

    return prevNextButton
}