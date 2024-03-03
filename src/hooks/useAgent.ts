import { useEffect, useState } from 'react'
import UAParser from 'ua-parser-js'


export const useAgent = () => {
    const [browser, setBrowser] = useState<string | null>()
    useEffect(() => {
        const parser = new UAParser('user-agent')
        parser.setUA(window.navigator.userAgent)
        setBrowser(parser.getBrowser().name)
    }, [])
    return {browser}
}