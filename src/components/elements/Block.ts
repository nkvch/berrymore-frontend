import styled from "@emotion/styled";

export const Block = styled.div`
  position: relative;
  min-height: 100px;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  transition: height 2s;
  &.content-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
