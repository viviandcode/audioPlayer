export const timerInit = (audio, timer) => {
    this.timerLoaded = true

    this.current = document.createElement('div')
    this.current.className = 'current'

    let duration = document.createElement('div')
    duration.className = 'duration'

    audio.addEventListener('loadeddata', () => {
        this.current.innerText = '00:00:00'
        duration.innerText = timeFormat(audio.duration)
    })

    let timer = {}
    timer.current = this.current
    timer.duration = duration
    return timer
}