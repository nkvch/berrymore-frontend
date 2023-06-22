import { useRecoilCallback } from "recoil"
import authState from "../../../recoil/authState";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  return useRecoilCallback(({ set }) => () => {
    set(authState, { user: null, isPending: false });
    localStorage.removeItem('jwt');
    navigate('/signin');
  });
}

export default useLogout;
