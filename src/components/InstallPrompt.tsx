'use client'
import { useState, useEffect } from "react"

function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
   /* eslint-disable @typescript-eslint/no-explicit-any */
    useEffect(() => {
      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      )
   
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])
  /* eslint-enable @typescript-eslint/no-explicit-any */
    if (isStandalone) {
      return null
    }
   
    return (
      <div>
        <h3>Install App</h3>
        <button>Add to Home Screen</button>
        {isIOS && (
          <p>
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon">
              {' '}
              ⎋{' '}
            </span>
            and then Add to Home Screen
            <span role="img" aria-label="plus icon">
              {' '}
              ➕{' '}
            </span>.
          </p>
        )}
      </div>
    )
  }
  export default InstallPrompt;