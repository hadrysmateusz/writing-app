import { useEffect, useState } from "react"
import { Subscription } from "rxjs"
import { RxQuery } from "rxdb"

import { cleanUpSubscriptions } from "../utils"

export function useRxSubscription<RxDocumentType, RxQueryResult>(
  query: RxQuery<RxDocumentType, RxQueryResult>
) {
  const [data, setData] = useState<RxQueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let subscription: Subscription | undefined

    const setup = async () => {
      // TODO: this should probably be paged
      // TODO: this should probably be cached somewhere above for better speed (but maybe not in MainProvider, it's a bit too high I think)
      // TODO: in-memory caching for better performnce when frequently switching between groups in one session
      // TODO: better decide when I should query the database directly and when to use (and where to store) the local documents list

      try {
        const newData = await query.exec()

        setData(newData)

        subscription = query.$.subscribe((newData) => {
          setData(newData)
        })
      } catch (error) {
        throw error // TODO: handle better in prod
      } finally {
        setIsLoading(false)
      }
    }

    setup()

    return () => cleanUpSubscriptions([subscription])
  }, [query])

  return { data, isLoading }
}

export default useRxSubscription
