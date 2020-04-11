import React from "react"
import styled from "styled-components/macro"

import { FeatureToggles, TriggerEvent } from "../Components"

const Toggle = styled.div`
  font-size: 13px;
`

const Container = styled.div`
  transition: all 0.3s;
  position: fixed;
  bottom: 0;
  background: black;
  opacity: 0.36;
  color: white;
  padding: 10px;

  :hover {
    opacity: 0.84;

    ${Toggle} {
      display: none;
    }
  }

  .tools {
    display: none;
  }

  :hover .tools {
    display: block;
  }
`

const DevTools = ({ local = null }) => {
  return (
    <Container>
      <Toggle>🛠</Toggle>
      <div className="tools">
        {local}
        <FeatureToggles />
        <TriggerEvent name="logEditor" />
      </div>
    </Container>
  )
}

export default DevTools
