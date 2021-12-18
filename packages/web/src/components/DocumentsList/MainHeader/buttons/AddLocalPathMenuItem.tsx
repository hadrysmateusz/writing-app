// TODO: figure out better place to put this

import { ContextMenuItem } from "../../../ContextMenu/Old"
import { useLocalFS } from "../../../LocalFSProvider"

export const AddLocalPathMenuItem = () => {
  const { addPath } = useLocalFS()
  return (
    <ContextMenuItem
      onClick={() => {
        addPath()
      }}
    >
      Add Path
    </ContextMenuItem>
  )
}
