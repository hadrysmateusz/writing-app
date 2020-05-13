import styled from "styled-components"

const Heading = styled.div`
  font-weight: bold;
  font-family: "Poppins";
  letter-spacing: 0.01em;
`

export const HeadingBig = styled(Heading)`
  :not(:first-child) {
    margin-top: 30px;
  }
  :not(:last-child) {
    margin-bottom: 12px;
  }
  font-size: 32px;
  line-height: 44px;
`

export const HeadingSmall = styled(Heading)`
  :not(:first-child) {
    margin-top: 18px;
  }
  :not(:last-child) {
    margin-bottom: 6px;
  }
  font-size: 26px;
  line-height: 40px;
`
