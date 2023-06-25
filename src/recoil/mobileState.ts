import { atom } from "recoil";
import isMobile from "../utils/is-mobile";

const mobileState = atom<boolean>({
  key: 'mobileState',
  default: isMobile(),
});

export default mobileState;
