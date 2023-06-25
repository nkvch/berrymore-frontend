import { ArrowDropDown } from '@mui/icons-material';
import { Button, Menu } from '@mui/material';
import React, { useState } from 'react';

interface DropdownButtonProps extends React.ComponentProps<typeof Button> {
  title: string;
}

const DropdownButton = ({ title, children, ...btnProps }: DropdownButtonProps) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button {...btnProps} onClick={handleClick}>
        {title} <ArrowDropDown />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </Menu>
    </>
  );
};

export default DropdownButton;
