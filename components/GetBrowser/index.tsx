import { useEffect } from 'react'

export enum Browser {
  Chrome = 'Chrome',
  Firefox = 'Firefox',
  Safari = 'Safari',
}

const GetBrowser = () => {
  useEffect(() => {
    const getBrowser = (): Browser => {
      const userAgent = navigator.userAgent

      if (userAgent.indexOf('CriOS') !== -1) {
        return Browser.Chrome
      } else if (userAgent.indexOf('FxiOS') !== -1) {
        return Browser.Firefox
      } else if (userAgent.indexOf('Chrome') !== -1) {
        return Browser.Chrome
      } else if (userAgent.indexOf('Safari') !== -1) {
        return Browser.Safari
      } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        return Browser.Safari
      }

      return Browser.Chrome
    }

    GetBrowser.get = getBrowser
  }, [])

  return null
}

GetBrowser.get = (): Browser => Browser.Chrome

export default GetBrowser
