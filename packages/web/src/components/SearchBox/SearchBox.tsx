import { memo, useCallback, useRef, useState } from "react"
import { Portal } from "react-portal"
import { useOnClickOutside, useToggleable } from "../../hooks"

import { Autocomplete, Option } from "../Autocomplete"
import { Coords, getElementMeasurements } from "../ContextMenu"
import { Icon } from "../Icon"
import { useTabsAPI } from "../TabsProvider"
import {
  AutocompleteContainer,
  DummySearchBox,
  OuterContainer,
} from "./SearchBox.styles"

const POSITIONING_OFFSET = 6

export const SearchBox: React.FC<{ options: Option[] }> = memo(
  ({ options }) => {
    const { openDocument } = useTabsAPI()

    const autocompleteInputRef = useRef<HTMLInputElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const searchTriggerBoxRef = useRef<HTMLDivElement | null>(null)

    const [coords, setCoords] = useState<Coords>([0, 0])

    const { isOpen, close, open } = useToggleable(false, {
      onBeforeOpen: () => {
        const triggerBoxEl = searchTriggerBoxRef.current
        if (!triggerBoxEl) {
          console.log("no element")
          return
        }

        const { leftEdge, topEdge } = getElementMeasurements(
          triggerBoxEl,
          [0, 0]
        )

        setCoords([leftEdge - POSITIONING_OFFSET, topEdge - POSITIONING_OFFSET])
      },
      onAfterOpen: () => {
        console.dir("after open", autocompleteInputRef?.current)
        // setTimeout is important for this to work
        setTimeout(() => {
          autocompleteInputRef?.current?.focus()
        }, 0)
      },
    })

    useOnClickOutside(containerRef, () => {
      // TODO: reset autocomplete inputValue on close (this might actually be desirable as accidental closes right now aren't exactly uncommon, I should maybe think about it again when I make the Submenu stay open while this component is dirty)
      if (isOpen) {
        close()
      }
    })

    const handleSubmit = useCallback(
      (option: Option) => {
        if (option.value) {
          openDocument(option.value)
          close()
        }
      },
      [close, openDocument]
    )

    return (
      <OuterContainer>
        <DummySearchBox onClick={() => open()} ref={searchTriggerBoxRef}>
          <Icon icon="search" /> Search
        </DummySearchBox>

        {isOpen ? (
          <Portal>
            <AutocompleteContainer
              ref={containerRef}
              xPos={coords[0]}
              yPos={coords[1]}
            >
              <Autocomplete
                suggestions={options}
                submit={handleSubmit}
                close={close}
                inputRef={autocompleteInputRef}
                placeholder="Search cloud documents"
                submitPrompt="Press 'Enter' to open document"
                focusOnHover={false}
              />
            </AutocompleteContainer>
          </Portal>
        ) : null}
      </OuterContainer>
    )
  }
)
