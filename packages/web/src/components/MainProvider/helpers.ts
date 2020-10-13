import { Subscription } from "rxjs"

export const cancelSubscription = (sub: Subscription | undefined) => {
  if (sub) {
    sub.unsubscribe()
  }
}

export const cancelSubscriptions = (...subs: (Subscription | undefined)[]) => {
  subs.forEach((sub) => cancelSubscription(sub))
}
