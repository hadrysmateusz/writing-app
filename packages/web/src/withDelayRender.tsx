import React, { useState, useEffect } from "react"

// TODO: probably needs many improvements and optimizations (might be able to use Suspense)
export const withDelayRender =
  (delay: number, CAlt: React.FC | null = null) =>
  (C: React.FC): React.FC =>
  (props) => {
    const [isDone, setIsDone] = useState(delay === 0)

    useEffect(() => {
      // render immediately if delay is set to 0
      if (delay === 0) return

      const timeoutId = setTimeout(() => setIsDone(true), delay)
      return () => clearTimeout(timeoutId)
    }, [])

    return isDone ? (
      <C {...props} />
    ) : CAlt === null ? null : (
      <CAlt {...props} />
    )
  }
