import styled from "styled-components/macro"

import { customScrollbar } from "../../../style-utils"

export const NavigatorSidebarContainer = styled.div`
  --navigator-sidebar-spacing: 20px;

  padding: var(--navigator-sidebar-spacing) 0;
  font-size: 12px;
  height: 100%;
  background: var(--bg-100);

  overflow-y: auto;
  ${customScrollbar}
`
