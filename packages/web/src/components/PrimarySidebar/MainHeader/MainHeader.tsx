import { withDelayRender } from "../../../withDelayRender"
import { Wrapper } from "./MainHeader.styles"

const EmptyDetailsPlaceholder = () => <div>&nbsp;</div> // This is here to prevent the buttons from jumping
const EmptyDetails = withDelayRender(
  100,
  EmptyDetailsPlaceholder
)(() => <>Figure out details for this view</>)

export const MainHeader: React.FC<{
  title: string
  numDocuments?: number
  numSubgroups?: number
  detailsMessage?: string
  buttons: React.ReactElement[]
}> = ({ title, numSubgroups, numDocuments, buttons, detailsMessage }) => {
  return (
    <Wrapper>
      <div className="MainHeader_HorizontalContainer">
        <div>
          <div className="MainHeader_MainText">{title}</div>
          <div className="MainHeader_Details">
            {detailsMessage ?? (
              <>
                {numDocuments ? `${numDocuments} documents` : null}
                {numDocuments && numSubgroups ? ", " : null}
                {numSubgroups ? `${numSubgroups} collections` : null}
                {!numDocuments && !numSubgroups ? <EmptyDetails /> : null}
              </>
            )}
          </div>
        </div>
        <>{buttons}</>
      </div>
    </Wrapper>
  )
}

export default MainHeader

// function qwer<S extends SidebarID>() {
//   return function asdf<
//     V extends SidebarView<S>,
//     SV extends SidebarSubview<S, V>,
//     ID extends string
//   >(v: V, sv: SV, id: ID) {}
// }

// function asdf2<
//   S extends SidebarID,
//   V extends SidebarView<S>,
//   SV extends SidebarSubview<S, V>,
//   ID extends string
// >(s: S, v: V, sv: SV, id: ID) {}
