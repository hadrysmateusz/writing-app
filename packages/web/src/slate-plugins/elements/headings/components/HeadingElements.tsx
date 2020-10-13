import styled, { css } from "styled-components/macro"

const Heading = styled.div<{ isEmpty: boolean }>`
  font-weight: bold;
  font-family: "Poppins";
  letter-spacing: 0.01em;
  position: relative;
  ${(p) =>
    p.isEmpty &&
    css`
      :before {
        color: #727475;
        user-select: none;
        pointer-events: none;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        content: attr(data-placeholder);
      }
    `}
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
