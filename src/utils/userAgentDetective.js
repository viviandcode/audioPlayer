export const userAgentDetective = () => {
    let u = navigator.userAgent

    if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
        return {
            os: 'windows',
            code: 0,
            mobile: false
        }
    } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
        return {
            os: 'macOS',
            code: 0,
            mobile: false
        }
    } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
        return { 
            os: 'ios',
            code: 1,
            mobile: true
        }
    } else if (!!u.match(/android/i)) {
        return {
            os: 'android',
            code: 1,
            mobile: true
        }
    } else {
        return {
            os: 'other',
            code: 2,
            mobile: false
        }
    }
}