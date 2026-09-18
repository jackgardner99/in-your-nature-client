import { useEffect, useRef, useState } from 'react'

function Reveal({ className = '', children }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default Reveal
