// seek gallery active item
export const galleryActive = ({ audio, galleryItems, itemClass, activeClass, galleryIndex }) => {
    let selectTimePoint = galleryItems[galleryIndex].getAttribute('time-point')

    let lastIndex = galleryItems.length - 1

    let nextIndex, nextTimePoint
    if (galleryIndex < lastIndex) {
        nextIndex = galleryIndex + 1
        nextTimePoint = galleryItems[nextIndex].getAttribute('time-point')
    }

    // 如果当前播放时间不在 selectItem 时间范围 [gallerySelectTimePoint, nextTimePoint), 则查找
    if (audio.currentTime < selectTimePoint || audio.currentTime >= nextTimePoint) {
        // 遍历 galleryItems 并查找
        for (let index = 0; index < galleryItems.length; index++) {
            let timePoint = galleryItems[index].getAttribute('time-point')

            // 先把所有子元素 class 赋值为未选中状态
            galleryItems[index].className = itemClass

            // 找到最后一个符合范围的 timePoint, 更新 this.gallerySelectIndex
            if (audio.currentTime >=  timePoint) {
                // console.log('found')
                // console.log('timePoint:' + timePoint)
                galleryIndex = index
            }
        }

        // 更新 gallerySelectTimePoint nextTimePoint
        galleryItems[galleryIndex].classList.add(activeClass)
        selectTimePoint = galleryItems[galleryIndex].getAttribute('time-point')
        if (galleryIndex < lastIndex) {
            nextIndex = galleryIndex + 1
            nextTimePoint = galleryItems[nextIndex].getAttribute('time-point')
        }

    }
    return galleryIndex
}