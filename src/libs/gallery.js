export const galleryInit = ({ data, gallery, itemClass, activeClass }) => {
    if (data === undefined || data === '') {
        console.error('no data!')
        return false
    }

    gallery.loaded = true

    if (itemClass === undefined || itemClass === '') {
        gallery.itemClass = 'gallery-item'
    } else {
        gallery.itemClass = itemClass
    }
    if (activeClass === undefined || activeClass === '') {
        gallery.activeClass = 'active'
    } else {
        gallery.activeClass = activeClass
    }

    gallery.items = []

    for (let index = 0; index < data.length; index++) {
        let galleryItem = document.createElement('figure')
        galleryItem.className = gallery.itemClass
        galleryItem.setAttribute('time-point', data[index].timePoint)

        let imgWrap = document.createElement('div')
        imgWrap.className = 'img-wrap'

        let img = document.createElement('div')
        img.className = 'img'

        let galleryImg = new Image()
        galleryImg.setAttribute('src', data[index].imgUrl)

        img.appendChild(galleryImg)
        imgWrap.appendChild(img)

        let contentWrap = document.createElement('div')
        contentWrap.className = 'content-wrap'

        let title = document.createElement('h3')
        title.className = 'title'
        title.innerText = data[index].title

        let content = document.createElement('div')
        content.className = 'content'
        content.innerText = data[index].context

        contentWrap.appendChild(title)
        contentWrap.appendChild(content)

        galleryItem.appendChild(imgWrap)
        galleryItem.appendChild(contentWrap)

        gallery.items.push(galleryItem)
    }

    // init gallery, default select first timepoint
    // gallery.gallery.items = gallery.items
    gallery.index = 0
    gallery.items[gallery.index].classList.add(gallery.activeClass)
}

// seek gallery active item
export const galleryActive = ({ audio, gallery }) => {
    let selectTimePoint = gallery.items[gallery.index].getAttribute('time-point')

    let lastIndex = gallery.items.length - 1

    let nextIndex, nextTimePoint
    if (gallery.index < lastIndex) {
        nextIndex = gallery.index + 1
        nextTimePoint = gallery.items[nextIndex].getAttribute('time-point')
    }

    // 如果当前播放时间不在 selectItem 时间范围 [gallerySelectTimePoint, nextTimePoint), 则查找
    if (audio.currentTime < selectTimePoint || audio.currentTime >= nextTimePoint) {
        // 遍历 gallery.items 并查找
        for (let index = 0; index < gallery.items.length; index++) {
            let timePoint = gallery.items[index].getAttribute('time-point')

            // 先把所有子元素 class 赋值为未选中状态
            gallery.items[index].className = gallery.itemClass

            // 找到最后一个符合范围的 timePoint, 更新 this.gallerySelectIndex
            if (audio.currentTime >=  timePoint) {
                gallery.index = index
            }
        }

        // update gallerySelectTimePoint nextTimePoint
        gallery.items[gallery.index].classList.add(gallery.activeClass)
        selectTimePoint = gallery.items[gallery.index].getAttribute('time-point')
        if (gallery.index < lastIndex) {
            nextIndex = gallery.index + 1
            nextTimePoint = gallery.items[nextIndex].getAttribute('time-point')
        }
    }
}