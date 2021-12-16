export const scrollToShow = function (
  element: HTMLElement,
  container: HTMLElement
) {
  const elementTop = element.offsetTop - container.offsetTop
  const elementBottom = elementTop + element.clientHeight

  const containerTop = container.scrollTop
  const containerBottom = containerTop + container.clientHeight

  // console.log(element, element.getBoundingClientRect())
  // console.log("element", elementTop, elementBottom)
  // console.log("container", containerTop, containerBottom)

  if (elementBottom > containerBottom) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  } else if (elementTop < containerTop) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}
