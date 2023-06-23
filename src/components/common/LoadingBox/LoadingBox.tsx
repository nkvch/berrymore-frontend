import { CircularProgress } from "@mui/material";
import { Container } from "./elelements";

function LoadingBox() {
  return (
    <Container>
      <CircularProgress />
    </Container>
  );
}

export default LoadingBox;
