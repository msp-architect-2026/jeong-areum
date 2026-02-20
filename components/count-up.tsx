"use client"

import { useEffect, useState } from "react"

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
}

export function CountUp({ end, duration = 1500, suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = end / (duration / 16)

    const animate = () => {
      start += increment
      if (start < end) {
        setCount(Math.floor(start))
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
