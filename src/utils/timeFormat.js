// 格式化时间显示
export const timeFormat = time => {
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
