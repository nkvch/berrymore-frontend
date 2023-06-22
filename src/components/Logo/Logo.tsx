import styled from '@emotion/styled';
import { Box, Collapse, Typography } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';

export interface LogoProps {
  subTitle: string;
}

const Img = styled.img`
  @media screen and (max-width: 340px) {
    display: none;
  }
`;

function Logo({ subTitle }: LogoProps) {
  return <Box
    style={{
      display: 'flex',
      gap: '10px',
      padding: '8px 12px',
      alignItems: 'center',
      cursor: 'pointer',
    }}
    onClick={() => window.location.href = '/'}
  >
    <Img alt="icon" src="/icon.svg" width="40" height="40" />
    <Box style={{
      display: 'inline-block',
    }}>
      <Typography
        display="flex"
        variant="h6"
        fontFamily={'ZenKakuGothicAntique'}
        sx={{ flexGrow: 1, lineHeight: 1.2 }}
      >
        Berrymore
      </Typography>
      <TransitionGroup style={{ height: 15 }}>
        <Collapse orientation="horizontal" key={subTitle}>
          <Typography
            variant='caption'
            component="div"
            sx={{ flexGrow: 1, lineHeight: 1.2, color: 'rgba(0, 0, 0, 0.54)' }}
          >
            {subTitle}
          </Typography>
        </Collapse>
      </TransitionGroup>
    </Box>

  </Box>
};

export default Logo;
