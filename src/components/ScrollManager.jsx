import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Client-side navigation doesn't scroll on its own: jump to the #hash target
// (e.g. /#contact) when there is one, otherwise back to the top of the page.
function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1))
    if (target) {
      target.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return null
}

export default ScrollManager
