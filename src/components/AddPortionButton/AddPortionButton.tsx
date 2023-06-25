import { AddCircle, QrCodeScanner } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedOut } from "../../recoil/authState";
import mobileState from "../../recoil/mobileState";

function AddPortionButton() {
  const navigate = useNavigate();
  const isMobile = useRecoilValue(mobileState);
  const isOnNewPortionPage = useMatch("/new-portion");
  const loggedout = useRecoilValue(isLoggedOut);

  if (isOnNewPortionPage || loggedout) {
    return null;
  }

  return (
    <IconButton
      style={{
        position: 'fixed',
        backgroundColor: 'white',
        borderRadius: '50%',
        width: 65,
        height: 65,
        bottom: 60,
        right: 15,
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)',
        zIndex: 1000,
      }}
      onClick={() => navigate('/new-portion')}
      size="large"
    >
      {isMobile ? <QrCodeScanner /> : <AddCircle />}
    </IconButton>
  );
}

export default AddPortionButton;
