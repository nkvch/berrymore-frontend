import styled from "@emotion/styled";
import withDefaultProps from "../../helpers/withDefaultProps";
import { Button } from "@mui/material";

export const AddButton = styled(withDefaultProps({ variant: 'contained' }, Button))`
  margin-top: 1rem;
`;
