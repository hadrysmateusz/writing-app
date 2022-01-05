import {
  usePlateEditorRef,
  BalloonToolbar as PlateBalloonToolbar,
  MarkToolbarButton,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_CODE,
  MARK_STRIKETHROUGH,
  ELEMENT_LINK,
  getPluginType,
} from "@udecode/plate"

import { useLinkModal } from "../LinkModal"
import { Icon } from "../../Icon"

import { ToolbarLink } from "./ToolbarLink"

export const BalloonToolbar = () => {
  const editor = usePlateEditorRef()
  const { getLinkUrl } = useLinkModal() // TODO: consider moving this inside the toolbar link component

  const arrow = false
  const theme = "dark"

  // TODO: rework these types
  const popperOptions = {
    placement: "top" as "top",
  }
  // const tooltip = {
  //   arrow: true,
  //   delay: 0,
  //   duration: [200, 0] as [number, number],
  //   hideOnClick: false,
  //   offset: [0, 17] as [number, number],
  //   placement: "top" as "top",
  // }

  // TODO: use styling matching the rest of the app
  return editor ? (
    <PlateBalloonToolbar
      popperOptions={popperOptions}
      theme={theme}
      arrow={arrow}
    >
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<Icon icon={MARK_BOLD} />}
        // tooltip={{ content: "Bold", ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<Icon icon={MARK_ITALIC} />}
        // tooltip={{ content: "Italic", ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<Icon icon={MARK_STRIKETHROUGH} />}
        // tooltip={{ content: "Strikethrough", ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_CODE)}
        icon={<Icon icon={MARK_CODE} />}
        // tooltip={{ content: "Code", ...tooltip }}
      />
      <ToolbarLink
        getLinkUrl={getLinkUrl}
        icon={<Icon icon={ELEMENT_LINK} />}
      />
    </PlateBalloonToolbar>
  ) : null
}
