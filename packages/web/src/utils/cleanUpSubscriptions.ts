import { Subscription } from "rxjs"

export const cleanUpSubscriptions = (subs: (Subscription | undefined)[]) => {
  for (const sub of subs) {
    if (sub) {
      sub.unsubscribe()
    }
  }
}
