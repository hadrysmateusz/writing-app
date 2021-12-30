import styled from "styled-components/macro"

// TODO: refine these styles
export const TextInput = styled.input`
  background: var(--dark-200);
  color: var(--light-300);

  padding: 6px 10px;

  min-width: 0;

  width: 100%;

  font-family: inherit;
  font-size: inherit;

  border: 1px solid var(--dark-500);
  border-radius: 3px;

  ::selection {
    color: white;
    background: var(--selection-color);
  }

  :focus,
  :focus-within {
    border-color: var(--dark-600);
    color: var(--light-400);
  }
`
