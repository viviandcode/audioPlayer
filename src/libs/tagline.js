import { timeFormat } from '../utils/timeFormat.js'

export const tagLineInit = ({ audio, data, tagLine, tagItemClass, progressDistance }) => {
    if (data === undefined || data === '') {
        console.error('no data!')
        return false
    }

    tagLine.loaded = true

    if (tagItemClass === undefined || tagItemClass === '') {
        tagLine.itemClass = 'item'
    } else {
        tagLine.itemClass = tagItemClass
    }

    // default 1 ms = 1.6666666px
    if (progressDistance === undefined || progressDistance === 0) {
        tagLine.progressDistance = 1.6666666666
    } else {
        tagLine.progressDistance = progressDistance
    }

    let progressWrap = document.createElement('div')
    progressWrap.className = 'progress-wrap'

    let progress = document.createElement('div')
    progress.className = 'progress'
    progress.id = 'progress'

    for (let index = 0; index < data.length; index++) {
        let item = document.createElement('figure')
        item.className = tagLine.itemClass
        item.setAttribute('time-point', data[index].timePoint)
        item.setAttribute('style', 'left:' + data[index].timePoint * tagLine.progressDistance + 'px')

        let timeLine = document.createElement('div')
        timeLine.className = 'time-line'

        let title = document.createElement('div')
        title.className = 'title'
        title.innerText = data[index].title

        let timeMark = document.createElement('div')
        timeMark.className = 'time-mark'
        timeMark.innerText = timeFormat(data[index].timePoint)

        item.appendChild(timeLine)
        item.appendChild(title)
        item.appendChild(timeMark)

        item.addEventListener('click', () => {
            audio.currentTime = data[index].timePoint
            audio.play()
        })

        progress.appendChild(item)
    }

    progressWrap.appendChild(progress)

    let timePointLine = document.createElement('div')
    timePointLine.className = 'time-point-line'

    let wrap = document.createElement('div')
    wrap.className = 'tag-line'
    wrap.appendChild(timePointLine)
    wrap.appendChild(progressWrap)

    tagLine.dom = wrap

    tagLineDrag({
        audio: audio,
        tagLine: tagLine
    })
}

export const tagLineProgress = ({ audio, tagLine }) => {
    tagLine.dom.querySelector('#progress').setAttribute('style', 'transform: translateX(-'+ audio.currentTime * tagLine.progressDistance +'px)')
}

export const tagLineDrag = ({ audio, tagLine, wrap }) => {
    let mouseDownFlag = false
    let startX

    tagLine.dom.addEventListener('mousedown', e => {
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

            let timeOffset = parseInt(Math.round(- distance / tagLine.progressDistance))

            // update audio time
            audio.currentTime = parseInt(audio.currentTime + timeOffset)
            // update progress position
            tagLine.dom.querySelector('#progress').setAttribute('style', 'transform: translateX(-'+ audio.currentTime * tagLine.progressDistance +'px);')
        }
    })
}