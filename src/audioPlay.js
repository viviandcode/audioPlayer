export class podcastPlayer {
    // 初始化, 传入 audio 标签的 id
    constructor({ id, src, playIcon, pauseIcon, updateTimer, loop }) {
        // 加载标示
        this.timerLoad = false
        this.timelineLoad = false
        this.galleryLoad = false
        this.shortcutsLoad = false

        // wrap 对象
        if (id === undefined || id === '') {
            console.warn('初始化: 没有传入 id!')
            return false
        }
        this.player = document.getElementById(id)

        // 创建 audio 元素
        this.audio = document.createElement('audio')
        this.audio.setAttribute('class', 'audio')

        // 如果传入 src 则初始化
        if (src !== undefined && src !== '') {
            this.audio.src = src
        }

        // 如果传入 updateTimer 则初始化, 默认 20 毫秒
        if (updateTimer !== undefined && updateTimer !== 0) {
            this.updateStep = updateTimer
        } else {
            this.updateStep = 20
        }

        // 是否循环播放, 默认不循环
        if (loop !== undefined && loop === true) {
            this.audio.loop = true
        } else {
            this.audio.loop = false
        }

        if (playIcon !== undefined && playIcon !== '') {
            this.playIcon = playIcon
        } else {
            this.playIcon = '>'
        }
        if (pauseIcon !== undefined && pauseIcon !== '') {
            this.pauseIcon = pauseIcon
        } else {
            this.pauseIcon = 'II'
        }

        // 向 player 中添加 audio 对象
        this.player.appendChild(this.audio)

        // 初始化播放按钮, 至少有一个这个吧
        this.playButton()
        this.player.insertBefore(this.playButton, this.audio)

        this.watchPlay()
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

    // 给 audio 添加统一的 play 事件监控
    watchPlay () {
        let setIntervalObj
        this.audio.addEventListener('play', () => {
            // 切换播放按钮
            this.playButton.innerHTML = this.pauseIcon

            setIntervalObj = setInterval(() => {
                // 更新 timer 的当前播放时间
                if (this.timerLoad) {
                    this.timer.firstElementChild.innerText = timeFormat(this.audio.currentTime)
                }

                // 更新 dot 的位置
                if (this.timelineLoad) {
                    let dot = this.timeline.lastElementChild
                    let progressPer = this.audio.currentTime / this.audio.duration
                    if (progressPer <= 1) {
                        dot.style.left = progressPer * 100 + '%'
                    } else {
                        dot.style.left = '100%'
                    }
                }

                // gallery 查找并更新元素
                if (this.galleryLoad) {
                    this.gallerySeekItem(this.gallery.children, this.galleryItemClass, this.galleryActiveClass)
                }

                // shortcuts
                if (this.shortcutsLoad) {
                    this.shortcutsViewProgress()
                }
            }, this.updateStep)
        })

        this.audio.addEventListener('pause', () => {
            this.playButton.innerHTML = this.playIcon
            clearInterval(setIntervalObj)
        })
    }

    // 加载播放按钮
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
    }

    // 加载时间显示
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
        this.player.insertBefore(this.timer, this.audio)
    }

    // 加载时间轴
    timeline () {
        // timeline 加载标示更新为 true
        this.timelineLoad = true

        this.timeline = document.createElement('div')
        this.timeline.setAttribute('class', 'timeline')

        let progressBar = document.createElement('div')
        progressBar.setAttribute('class', 'progress-bar')

        let dot = document.createElement('command')
        dot.setAttribute('class', 'dot')

        this.timeline.appendChild(progressBar)
        this.timeline.appendChild(dot)
        this.player.insertBefore(this.timeline, this.timer)

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
                // 暂停状态下, 更新 timer 显示时间
                if (this.timerLoad) {
                    this.timer.firstElementChild.innerText = timeFormat(this.audio.currentTime)
                }
                // 机核是直接播
                // this.audio.play()
                if (this.galleryLoad) {
                    this.gallerySeekItem(this.gallery.children, this.galleryItemClass, this.galleryActiveClass)
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
            if (this.timerLoad) {
                this.timer.firstElementChild.innerText = timeFormat(this.audio.currentTime)
            }
            if (this.galleryLoad) {
                this.gallerySeekItem(this.gallery.children, this.galleryItemClass, this.galleryActiveClass)
            }
        })
    }

    // 加载 Gallery
    gallery ({ data, itemClass, activeClass }) {
        // gallery 加载标示更新为 true
        this.galleryLoad = true

        if (itemClass === undefined || itemClass === '') {
            this.galleryItemClass = 'gallery-item'
        } else {
            this.galleryItemClass = _temClass
        }
        if (activeClass === undefined || activeClass === '') {
            this.galleryActiveClass = 'active'
        } else {
            this.galleryActiveClass = activeClass
        }
        
        this.gallery = document.createElement('div')
        this.gallery.setAttribute('class', 'gallery-wrap')

        for (let index = 0; index < data.length; index++) {
            let galleryItem = document.createElement('figure')
            galleryItem.setAttribute('class', this.galleryItemClass)
            galleryItem.setAttribute('time-point', data[index].timePoint)

            let galleryImg = new Image()
            galleryImg.setAttribute('src', data[index].imgUrl)

            galleryItem.appendChild(galleryImg)
            this.gallery.appendChild(galleryItem)
        }

        this.player.insertBefore(this.gallery, this.playButton)

        let galleryItems = this.gallery.children
        // 初始化 gallery 需显示的时间点, 默认选中第一个
        this.gallerySelectIndex = 0
        this.gallerySelectTimePoint = galleryItems[this.gallerySelectIndex].getAttribute('time-point')
        galleryItems[this.gallerySelectIndex].setAttribute('class', this.galleryItemClass + ' ' + this.galleryActiveClass)
    }

    // gallery 查找并更新元素
    gallerySeekItem (galleryItems, itemClass, activeClass) {
        // 最后一个子元素的 index
        let lastIndex = galleryItems.length - 1

        // selectItem 的下一个元素
        let nextTimePoint
        if (this.gallerySelectIndex < lastIndex) {
            let nextIndex = this.gallerySelectIndex + 1
            nextTimePoint = galleryItems[nextIndex].getAttribute('time-point')
        }

        // 如果当前播放时间不在 selectItem 时间范围 [gallerySelectTimePoint, nextTimePoint), 则查找
        if (this.audio.currentTime < this.gallerySelectTimePoint || this.audio.currentTime >= nextTimePoint) {
            // 遍历 galleryItems 并查找
            for (let index = 0; index < galleryItems.length; index++) {
                let timePoint = galleryItems[index].getAttribute('time-point')

                // 先把所有子元素 class 赋值为未选中状态
                galleryItems[index].setAttribute('class', itemClass)

                // 找到最后一个符合范围的 timePoint, 更新 this.gallerySelectIndex
                if (this.audio.currentTime >=  timePoint) {
                    this.gallerySelectIndex = index
                }
            }

            // 更新 gallerySelectTimePoint
            galleryItems[this.gallerySelectIndex].setAttribute('class', itemClass + ' ' + activeClass)
            this.gallerySelectTimePoint = galleryItems[this.gallerySelectIndex].getAttribute('time-point')
        }
    }

    // 有标签的时间轴
    shortcutsView ({ data, shortcutItemClass }) {
        this.shortcutsLoad = true
        if (shortcutItemClass === undefined || shortcutItemClass === '') {
            this.shortcutItemClass = 'short-cut-item'
        } else {
            this.shortcutItemClass = shortcutItemClass
        }

        let progressDistance = 1.6666666666

        this.shortcutsView = document.createElement('div')
        this.shortcutsView.setAttribute('class', 'short-cuts')

        let wrap = document.createElement('div')
        wrap.setAttribute('class', 'short-cut-wrap')

        let progress = document.createElement('div')
        progress.setAttribute('class', 'short-cut-progress')

        for (let index = 0; index < data.length; index++) {
            let shortcutItem = document.createElement('figure')
            shortcutItem.setAttribute('class', this.shortcutItemClass)
            shortcutItem.setAttribute('time-point', data[index].timePoint)
            // 默认 1 毫秒 为 1.6666666px
            shortcutItem.setAttribute('style', 'left:' + data[index].timePoint * progressDistance + 'px')

            let title = document.createElement('div')
            title.innerText = data[index].title

            shortcutItem.appendChild(title)

            shortcutItem.addEventListener('click', () => {
                this.audio.currentTime = data[index].timePoint
                this.audio.play()
            })

            progress.appendChild(shortcutItem)
        }

        wrap.appendChild(progress)
        this.shortcutsView.appendChild(wrap)

        this.player.insertBefore(this.shortcutsView, this.playButton)
    }
    shortcutsViewProgress () {
        let progressDistance = 1.6666666666
        this.shortcutsView.firstElementChild.firstElementChild.setAttribute('style', 'transform: translateX(-'+ this.audio.currentTime * progressDistance +'px);')
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