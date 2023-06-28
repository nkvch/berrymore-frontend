import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import * as React from 'react';

interface AccordionItemProps {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}

export const AccordionItem = ({ title, children }: AccordionItemProps) => {
  return <div key={title} style={{
  }} >{children}</div>;
}

interface AccordionsProps {
  children: React.ReactElement<AccordionItemProps>[];
}

export function Accordions({ children }: AccordionsProps) {
  return (
    <div>
      {React.Children.map(children, child => (
        <Accordion
          defaultExpanded={child.props.open}
        >
          <AccordionSummary
            sx={{
              flexDirection: 'row-reverse',
              gap: '20px'
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography
              variant='h6'
            >{child.props.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {child}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
