import { timeFormat } from '../utils/timeFormat.js'

export const timerInit = ({ audio, timer }) => {
    timer.loaded = true

    timer.current = document.createElement('div')
    timer.current.className = 'current'

    let duration = document.createElement('div')
    duration.className = 'duration'

    audio.addEventListener('loadeddata', () => {
        timer.current.innerText = '00:00:00'
        duration.innerText = timeFormat(audio.duration)
    })

    timer.duration = duration
}

export const timerPlayProcess = ({ audio, timer }) => {
    timer.current.innerText = timeFormat(audio.currentTime)
}