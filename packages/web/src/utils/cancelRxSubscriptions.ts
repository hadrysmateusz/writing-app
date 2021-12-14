import { Subscription } from "rxjs"

export const cancelRxSubscription = (sub: Subscription | undefined) => {
  if (sub) {
    sub.unsubscribe()
  }
}

export const cancelRxSubscriptions = (
  ...subs: (Subscription | undefined)[]
) => {
  subs.forEach((sub) => cancelRxSubscription(sub))
}
