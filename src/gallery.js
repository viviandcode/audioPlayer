// seek gallery active item
export const galleryActive = ({ audio, gallerySelectIndex, gallerySelectTimePoint, galleryItems, itemClass, activeClass }) => {
    let lastIndex = galleryItems.length - 1

    let nextTimePoint
    if (gallerySelectIndex < lastIndex) {
        let nextIndex = gallerySelectIndex + 1
        nextTimePoint = galleryItems[nextIndex].getAttribute('time-point')
    }

    // 如果当前播放时间不在 selectItem 时间范围 [gallerySelectTimePoint, nextTimePoint), 则查找
    if (audio.currentTime < gallerySelectTimePoint || audio.currentTime >= nextTimePoint) {
        // 遍历 galleryItems 并查找
        for (let index = 0; index < galleryItems.length; index++) {
            let timePoint = galleryItems[index].getAttribute('time-point')

            // 先把所有子元素 class 赋值为未选中状态
            galleryItems[index].className = itemClass

            // 找到最后一个符合范围的 timePoint, 更新 this.gallerySelectIndex
            if (audio.currentTime >=  timePoint) {
                gallerySelectIndex = index
            }
        }

        // 更新 gallerySelectTimePoint
        galleryItems[gallerySelectIndex].classList.add(activeClass)
        gallerySelectTimePoint = galleryItems[gallerySelectIndex].getAttribute('time-point')
    }
}