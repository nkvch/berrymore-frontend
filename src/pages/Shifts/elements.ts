import styled from "@emotion/styled";

export const HorizontalStackAvatar = styled.div`
  display: flex;
  flex-direction: row;
  // align-items: center;
  // justify-content: center;
  .MuiAvatar-root {
    position: relative;
    z-index: 1;
    margin-left: -15px;
    &:first-child {
      margin-left: 0;
    }
  }
`;
