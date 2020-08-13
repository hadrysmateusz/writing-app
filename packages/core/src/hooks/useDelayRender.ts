import { useState, useEffect } from "react"

// TODO: probably needs many improvements and optimizations (might be able to use Suspense)
export const useDelayRender = (
  render: React.ReactNode,
  alt: React.ReactNode,
  delay: number
) => {
  const [isDone, setIsDone] = useState(delay === 0)

  useEffect(() => {
    // render immediately if delay is set to 0
    if (delay === 0) return

    const timeoutId = setTimeout(() => setIsDone(true), delay)
    return () => clearTimeout(timeoutId)
  }, [delay])

  return isDone ? render : alt
}
