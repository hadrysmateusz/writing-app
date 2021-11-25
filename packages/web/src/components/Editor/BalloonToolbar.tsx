import {
  usePlateEditorRef,
  BalloonToolbar as PlateBalloonToolbar,
  MarkToolbarButton,
  getPlatePluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_CODE,
  MARK_STRIKETHROUGH,
  ELEMENT_LINK,
} from "@udecode/plate"

import { ToolbarLink } from "../Toolbar"
import { useLinkModal } from "../LinkPrompt"
import Icon from "../Icon"

export const BalloonToolbar = () => {
  const editor = usePlateEditorRef()
  const { getLinkUrl } = useLinkModal() // TODO: consider moving this inside the toolbar link component

  const arrow = false
  const theme = "dark"

  // TODO: rework these types
  const popperOptions: { placement: "top" } = {
    placement: "top",
  }
  const tooltip: {
    arrow: boolean
    delay: number
    duration: [number, number]
    hideOnClick: false
    offset: [number, number]
    placement: "top"
  } = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: "top",
  }

  // TODO: use styling matching the rest of the app
  return (
    <PlateBalloonToolbar
      popperOptions={popperOptions}
      theme={theme}
      arrow={arrow}
    >
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<Icon icon={MARK_BOLD} />}
        tooltip={{ content: "Bold", ...tooltip }}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<Icon icon={MARK_ITALIC} />}
        tooltip={{ content: "Italic", ...tooltip }}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<Icon icon={MARK_STRIKETHROUGH} />}
        tooltip={{ content: "Strikethrough", ...tooltip }}
      />
      <MarkToolbarButton
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<Icon icon={MARK_CODE} />}
        tooltip={{ content: "Code", ...tooltip }}
      />
      <ToolbarLink
        getLinkUrl={getLinkUrl}
        icon={<Icon icon={ELEMENT_LINK} />}
      />
    </PlateBalloonToolbar>
  )
}
