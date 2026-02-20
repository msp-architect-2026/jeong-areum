"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  endsAt: string
  compact?: boolean
}

function getTimeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  }
}

export function CountdownTimer({ endsAt, compact = false }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    setMounted(true)
    setTime(getTimeLeft(endsAt))
    const interval = setInterval(() => {
      setTime(getTimeLeft(endsAt))
    }, 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  if (!mounted) {
    return compact ? (
      <span className="font-mono text-sm font-semibold text-primary">--:--:--</span>
    ) : (
      <div className="flex items-center gap-1.5">
        {["시간", "분", "초"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-mono text-lg font-bold text-primary-foreground">--</span>
            <span className="mt-0.5 text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    )
  }

  if (time.expired) {
    return <span className="text-destructive font-semibold text-sm">마감</span>
  }

  const pad = (n: number) => n.toString().padStart(2, "0")

  if (compact) {
    return (
      <span className="font-mono text-sm font-semibold text-primary">
        {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {[
        { label: "시간", value: pad(time.hours) },
        { label: "분", value: pad(time.minutes) },
        { label: "초", value: pad(time.seconds) },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-mono text-lg font-bold text-primary-foreground">
            {item.value}
          </span>
          <span className="mt-0.5 text-[10px] text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
