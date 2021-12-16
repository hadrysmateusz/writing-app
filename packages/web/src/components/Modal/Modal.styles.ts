import styled from "styled-components/macro"

export const ModalContainer = styled.div`
  background: var(--dark-300);
  border: 1px solid var(--dark-500);
  padding: 20px 20px 20px;
  border-radius: 4px;
  color: var(--light-400);
  font-size: 13px;
`

export const ModalMessageContainer = styled.div`
  color: var(--light-500);
  font-weight: bold;
  margin-bottom: 14px;
  font-size: 16px;
`

export const ModalSecondaryMessageContainer = styled.div`
  margin-top: -4px;
  margin-bottom: 14px;
  font-size: 11px;
  font-weight: normal;
  color: var(--light-300);
  line-height: 1.5;

  ul,
  ol {
    margin: 6px 0 0;
    padding-left: 0;
    list-style-position: inside;
  }

  li::marker {
    color: var(--light-500);
  }

  em {
    font-style: normal;
    color: var(--light-500);
  }
`

export const ModalButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  > * {
    width: 100%;
  }
`

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
`

export const ModalBox = styled.div`
  z-index: 1001;
  position: relative;
`
