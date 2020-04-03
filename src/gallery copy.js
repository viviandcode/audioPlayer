// seek gallery active item
export const galleryActive = ({ audio, gallerySelect, _gallerySelectIndex, _gallerySelectTimePoint, galleryItems, itemClass, activeClass }) => {
    let gallerySelectIndex = gallerySelect.index
    let gallerySelectTimePoint = gallerySelect.timePoint
    let lastIndex = galleryItems.length - 1

    let nextIndex, nextTimePoint
    if (gallerySelectIndex < lastIndex) {
        nextIndex = gallerySelectIndex + 1
        nextTimePoint = galleryItems[nextIndex].getAttribute('time-point')
    }
    console.log('外部gallerySelectIndex:' + gallerySelectIndex)
    console.log('外部gallerySelectTimePoint:' + gallerySelectTimePoint)
    console.log('外部nextTimePoint:' + nextTimePoint)

    // 如果当前播放时间不在 selectItem 时间范围 [gallerySelectTimePoint, nextTimePoint), 则查找
    if (audio.currentTime < gallerySelectTimePoint || audio.currentTime >= nextTimePoint) {
        // 下面3哥一直没更新？？？
        console.log('gallerySelectIndex:' + gallerySelectIndex)
        console.log('gallerySelectTimePoint:' + gallerySelectTimePoint)
        console.log('nextTimePoint:' + nextTimePoint)
        console.log('currentTime:' + audio.currentTime)
        console.log('查找时间')
        // 遍历 galleryItems 并查找
        for (let index = 0; index < galleryItems.length; index++) {
            let timePoint = galleryItems[index].getAttribute('time-point')

            // 先把所有子元素 class 赋值为未选中状态
            galleryItems[index].className = itemClass

            // 找到最后一个符合范围的 timePoint, 更新 this.gallerySelectIndex
            if (audio.currentTime >=  timePoint) {
                console.log('found')
                console.log('timePoint:' + timePoint)
                gallerySelectIndex = index
            }
        }

        // 更新 gallerySelectTimePoint nextTimePoint
        galleryItems[gallerySelectIndex].classList.add(activeClass)
        gallerySelectTimePoint = galleryItems[gallerySelectIndex].getAttribute('time-point')
        if (gallerySelectIndex < lastIndex) {
            nextIndex = gallerySelectIndex + 1
            nextTimePoint = galleryItems[nextIndex].getAttribute('time-point')
        }
        console.log('更新gallerySelectIndex:' + gallerySelectIndex)
        console.log('更新gallerySelectTimePoint:' + gallerySelectTimePoint)
        console.log('更新nextTimePoint:' + nextTimePoint)
        console.log('==========================')
    }
    return gallerySelectIndex
}