import { useEffect, useState } from "react"
import { Subscription } from "rxjs"
import { RxQuery } from "rxdb"
import cloneDeep from "lodash/cloneDeep"

import { cancelRxSubscription } from "../utils"

// TODO: add variant with a transformer function to transform query results into the stored and returned data
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

        // console.log("initial: query", JSON.stringify(query.toJSON(), null, 2))
        setData(cloneDeep(newData))

        subscription = query.$.subscribe((newData) => {
          // console.log("sub: query", JSON.stringify(query.toJSON(), null, 2))
          setData(cloneDeep(newData))
        })
      } catch (error) {
        throw error // TODO: handle better in prod
      } finally {
        setIsLoading(false)
      }
    }

    setup()

    return () => cancelRxSubscription(subscription)
  }, [query])

  return { data, isLoading }
}

export default useRxSubscription
