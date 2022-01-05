import { Icon, IconNames } from "../../../Icon"

export const MainHeaderButton: React.FC<{
  icon: IconNames
  tooltip: string
  action: (e: React.MouseEvent<HTMLDivElement>) => void
}> = ({ icon, action, tooltip }) => {
  return (
    <div
      className="MainHeader_ButtonContainer"
      onClick={action}
      title={tooltip}
    >
      <Icon icon={icon} />
    </div>
  )
}
