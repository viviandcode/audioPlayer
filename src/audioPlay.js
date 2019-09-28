export class AudioPlayer {
    // 初始化, 传入 audio 标签的 id
    constructor({ id, src,  updateTimer, loop }) {
        this.updateStep = 10
        this.playIcon = '>'
        this.pauseIcon = 'II'

        // 加载标示
        this.timerLoad = false
        this.timelineLoad = false
        this.galleryLoad = false

        // wrap 对象
        if (id === undefined || id === '') {
            console.warn('初始化: 没有传入 id!')
            return false
        }
        this.wrap = document.getElementById(id)

        // 创建 audio 元素
        this.audio = document.createElement('audio')
        this.audio.setAttribute('class', 'audio')

        // 向 div#wrap 中添加 audio 对象
        this.wrap.appendChild(this.audio)

        // 初始化播放按钮
        this.playButton()
        this.wrap.insertBefore(this.playButton, this.audio)

        // 如果传入 src 则初始化
        if (src !== undefined && src !== '') {
            this.audio.src = src
        }

        // 如果传入 updateTimer 则初始化, 默认 20 毫秒
        if (updateTimer !== undefined && updateTimer !== 0) {
            this.updateStep = updateTimer
        }

        // 是否循环播放, 默认不循环
        if (loop !== undefined && loop === true) {
            this.audio.loop = true
        }
    }

    // 音频地址快捷借口
    set src (src) {
        this.audio.src = src
    }
    get src () {
        return this.audio.src
    }

    // 循环播放设置快捷借口
    set loop (loop) {
        if (loop === true) {
            this.audio.loop = true
        }
    }
    get loop () {
        return this.audio.loop
    }

    // 播放按钮图标设置快捷借口
    icon ({ playIcon, pauseIcon }) {
        if (play !== undefined && play !== '') {
            this.playIcon = playIcon
        }
        if (pause !== undefined && pause !== '') {
            this.pauseIcon = pauseIcon
        }
    }

    // 播放按钮
    playButton () {
        this.playButton = document.createElement('div')
        this.playButton.setAttribute('class', 'play-button')
        this.playButton.innerHTML = this.playIcon

        this.playButton.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play()
            } else {
                this.audio.pause()
            }
        })
        this.audio.addEventListener('play', () => {
            this.playButton.innerHTML = this.pauseIcon
        })
        this.audio.addEventListener('pause', () => {
            this.playButton.innerHTML = this.playIcon
        })
    }

    // 显示时间
    timer () {
        // timer 加载标示更新为 true
        this.timerLoad = true

        this.timer = document.createElement('div')
        this.timer.setAttribute('class', 'timer')

        let current = document.createElement('div')
        current.setAttribute('class', 'current')

        let duration = document.createElement('div')
        duration.setAttribute('class', 'duration')

        this.audio.addEventListener('loadeddata', () => {
            current.innerText = '00:00:00'
            duration.innerText = timeFormat(this.audio.duration)
        })

        this.timer.appendChild(current)
        this.timer.appendChild(duration)

        this.wrap.insertBefore(this.timer, this.audio)

        let setIntervalObj
        this.audio.addEventListener('play', () => {
            setIntervalObj = setInterval(() => {
                current.innerText = timeFormat(this.audio.currentTime)
            }, this.updateStep)
        })
        // 清除后, 暂停状态需要专门更新显示时间
        this.audio.addEventListener('pause', () => {
            clearInterval(setIntervalObj)
        })
    }

    // 时间轴
    timeline () {
        // timeline 加载标示更新为 true
        this.timelineLoad = true

        this.timeline = document.createElement('section')
        this.timeline.setAttribute('class', 'timeline')

        let progressBar = document.createElement('div')
        progressBar.setAttribute('class', 'progress-bar')

        let dot = document.createElement('div')
        dot.setAttribute('class', 'dot')

        this.timeline.appendChild(progressBar)
        this.timeline.appendChild(dot)

        this.wrap.insertBefore(this.timeline, this.timer)

        // 监听播放过程, 更新当前时间
        // memory leak ?
        let setIntervalObj
        this.audio.addEventListener('play', () => {
            setIntervalObj = setInterval(() => {
                // 播放百分比
                let progressPer = this.audio.currentTime / this.audio.duration
                if (progressPer <= 1) {
                    dot.style.left = progressPer * 100 + '%'
                } else {
                    dot.style.left = '100%'
                }
            }, this.updateStep)
        })
        this.audio.addEventListener('pause', () => {
            clearInterval(setIntervalObj)
        })

        this.mouseClickProgressBar(dot, progressBar)
        this.mouseMoveDot(dot, progressBar)
    }

    // 鼠标移动 dot
    mouseMoveDot (dragObj, progressBarObj) {
        let mouseDownFlag = false

        dragObj.onmousedown = () => {
            mouseDownFlag = true
        }
        document.onmouseup = () => {
            mouseDownFlag = false
        }
        document.onmousemove = e => {
            if (mouseDownFlag) {
                // 当前的坐标
                let currentX = e.clientX
                let progressBarWidth = progressBarObj.offsetWidth
                if (currentX < 0) {
                    dragObj.style.left = "0%"
                } else if (currentX > progressBarWidth) {
                    dragObj.style.left = "100%"
                } else {
                    dragObj.style.left = currentX / progressBarWidth * 100 + "%"
                }

                // 更新音频当前播放时间
                this.audio.currentTime = currentX / progressBarWidth * this.audio.duration
                // 此为暂停状态下, 更新 timer 显示时间
                this.timer.firstElementChild.innerText = timeFormat(this.audio.currentTime)

                if (e.preventDefault) {
					e.preventDefault()
				}
				return false
            }
        }
    }

    // 鼠标点击时间轴
    mouseClickProgressBar (dragObj, progressBarObj) {
        progressBarObj.addEventListener('click', e => {
            dragObj.style.left = e.clientX / progressBarObj.offsetWidth * 100 + "%"
            this.audio.currentTime = e.clientX / progressBarObj.offsetWidth * this.audio.duration
            this.timer.firstElementChild.innerText = timeFormat(this.audio.currentTime)
        })
    }

    // Gallery
    gallery ({ data, itemClass, activeClass }) {
        // gallery 加载标示更新为 true
        this.galleryLoad = true

        this.gallery = document.createElement('div')
        this.gallery.setAttribute('class', 'gallery-wrap')

        for (let index = 0; index < data.length; index++) {
            let galleryItem = document.createElement('div')
            galleryItem.setAttribute('class', 'gallery-item')
            galleryItem.setAttribute('timePoint', data[index].timePoint)

            let galleryImg = document.createElement('img')
            galleryImg.setAttribute('src', data[index].imgUrl)

            galleryItem.appendChild(galleryImg)

            galleryItem.addEventListener('click', () => {
                this.audio.currentTime = data[index].timePoint
                this.audio.play()
            })

            this.gallery.appendChild(galleryItem)
        }

        this.wrap.insertBefore(this.gallery, this.playButton)
        this.gallerySlide(itemClass, activeClass)
    }

    gallerySlide (_itemClass, _activeClass) {
        let galleryItems = this.gallery.children

        let itemClass, activeClass
        if (_itemClass === undefined || _itemClass === '') {
            itemClass = 'gallery-item'
        } else {
            itemClass = _itemClass
        }

        if (_activeClass === undefined || _activeClass === '') {
            activeClass = 'active'
        } else {
            activeClass = _activeClass
        }

        // 初始化 gallery 需显示的时间点, 默认选中第一个, class 为 now
        let selectIndex = 0
        let selectTimePoint = galleryItems[selectIndex].getAttribute('timePoint')
        galleryItems[selectIndex].setAttribute('class', itemClass + ' ' + activeClass)

        let setIntervalObj
        this.audio.addEventListener('play', () => {
            setIntervalObj = setInterval(() => {
                // 最后一个子元素的 index
                let lastIndex = galleryItems.length - 1

                // selectItem 的下一个元素
                let nextTimePoint
                if (selectIndex < lastIndex) {
                    let nextIndex = selectIndex + 1
                    nextTimePoint = galleryItems[nextIndex].getAttribute('timePoint')
                }


                // 如果当前播放时间不在 selectItem 时间范围 [selectTimePoint, nextTimePoint), 则查找
                if (this.audio.currentTime < selectTimePoint || this.audio.currentTime >= nextTimePoint) {
                    // 遍历 galleryItems 并查找
                    for (let index = 0; index < galleryItems.length; index++) {
                        let timePoint = galleryItems[index].getAttribute('timePoint')

                        // 先把所有子元素 class 赋值为未选中状态
                        galleryItems[index].setAttribute('class', itemClass)

                        // 找到最后一个符合范围的 timePoint, 更新 selectIndex
                        if (this.audio.currentTime >=  timePoint) {
                            selectIndex = index
                        }
                    }

                    // 更新 selectTimePoint
                    galleryItems[selectIndex].setAttribute('class', itemClass + ' ' + activeClass)
                    selectTimePoint = galleryItems[selectIndex].getAttribute('timePoint')
                }
            }, this.updateStep)
        })
        this.audio.addEventListener('pause', () => {
            clearInterval(setIntervalObj)
        })
    }
}

// 格式化时间显示
let timeFormat = time => {
    let total = Math.round(time)
    let allHour = parseInt(total / 3600)
    if (allHour < 10) {
        allHour = '0' + allHour
    }
    let allMin = parseInt(total % 3600 / 60)
    if (allMin < 10) {
        allMin = '0' + allMin
    }
    let allSec = total % 60
    if (allSec < 10) {
        allSec = '0' + allSec
    }
    return allHour + ':' + allMin + ':' + allSec
}