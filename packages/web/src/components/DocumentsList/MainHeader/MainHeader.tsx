import { Wrapper } from "./MainHeader.styles"

export const MainHeader: React.FC<{
  title: string
  numSubgroups?: number
  buttons: React.ReactElement[]
}> = ({ title, numSubgroups, buttons }) => {
  // TODO: use real documents data in MainHeader_Detail
  return (
    <Wrapper>
      <div className="MainHeader_HorizontalContainer">
        <div>
          <div className="MainHeader_MainText">{title}</div>
          <div className="MainHeader_Details">
            X documents{numSubgroups ? `, ${numSubgroups} collections` : null}
          </div>
        </div>
        <>{buttons}</>
      </div>
    </Wrapper>
  )
}

export default MainHeader

// function qwer<S extends SidebarSidebar>() {
//   return function asdf<
//     V extends SidebarView<S>,
//     SV extends SidebarSubview<S, V>,
//     ID extends string
//   >(v: V, sv: SV, id: ID) {}
// }

// function asdf2<
//   S extends SidebarSidebar,
//   V extends SidebarView<S>,
//   SV extends SidebarSubview<S, V>,
//   ID extends string
// >(s: S, v: V, sv: SV, id: ID) {}
