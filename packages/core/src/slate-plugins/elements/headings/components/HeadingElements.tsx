import styled from "styled-components/macro"

const Heading = styled.div`
  font-weight: bold;
  font-family: "Poppins";
  letter-spacing: 0.01em;
  position: relative;
`

export const Heading1 = styled(Heading)`
  :not(:first-child) {
    margin-top: 30px;
  }
  :not(:last-child) {
    margin-bottom: 12px;
  }
  font-size: 30px;
  line-height: 40px;
`

export const Heading2 = styled(Heading)`
  :not(:first-child) {
    margin-top: 18px;
  }
  :not(:last-child) {
    margin-bottom: 6px;
  }
  font-size: 26px;
  line-height: 40px;
`

export const Heading3 = styled(Heading)`
  :not(:first-child) {
    margin-top: 18px;
  }
  :not(:last-child) {
    margin-bottom: -4px;
  }
  font-size: 22px;
  line-height: 36px;
`

export const Heading4 = styled(Heading)`
  :not(:first-child) {
    margin-top: 18px;
  }
  :not(:last-child) {
    margin-bottom: -4px;
  }
  font-size: 20px;
  line-height: 40px;
`

export const Heading5 = styled(Heading)`
  :not(:first-child) {
    margin-top: 18px;
  }
  :not(:last-child) {
    margin-bottom: -4px;
  }
  font-size: 18px;
  line-height: 30px;
`

export const Heading6 = styled(Heading)`
  :not(:first-child) {
    margin-top: 18px;
  }
  :not(:last-child) {
    margin-bottom: -4px;
  }
  font-size: 16px;
  line-height: 28px;
`
