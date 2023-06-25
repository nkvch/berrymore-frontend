import styled from "@emotion/styled";
import withDefaultProps from "../../../../helpers/withDefaultProps";
import { Button, Typography } from "@mui/material";
import Form from "../../../../components/common/Form/Form";

export const ModalTitle = styled(withDefaultProps({ variant: 'h5' }, Typography))`
  margin-right: 2rem;
`;

export const DatesForm = styled(Form)`
  margin-top: 1rem;
`;

export const PayButton = styled(withDefaultProps({ variant: 'outlined', color: 'warning' }, Button))`
  width: 100%;
  margin-top: 1rem;
`;