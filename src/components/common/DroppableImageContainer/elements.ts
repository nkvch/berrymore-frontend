import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const MainBox = styled(Box)`
  display: flex;
  flex-flow: column;
  align-items: center;
  border-width: 1px;
  border-color: rgba($color: #000000, $alpha: 0.3);
  border-style: dashed;
  border-radius: 0.4em;
  padding: 1em;
  font-weight: 100;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    background-color: rgba(128, 128, 128, 0.233);
  }

  margin-bottom: 8px;
`;

export const Label = styled.p`
  color: #000000;
`;

export const UploadBtn = styled.span`
  text-decoration: underline;

  &:hover {
    color: rgb(0, 87, 138);
  }
`;

export const Image = styled.img`
  width: 100%;
`;
