import styled from '@emotion/styled';
import Alert from '@mui/material/Alert';
import withDefaultProps from '../../helpers/withDefaultProps';

export default styled(withDefaultProps({ severity: 'error' }, Alert))`
  margin-bottom: 8px;
  padding-top: 0;
  padding-bottom: 0;
`;
