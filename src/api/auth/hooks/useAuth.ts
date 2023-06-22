import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getJwtExpDate from "../../../utils/getJwtExpDate";
import refreshToken from "../resfreshToken";
import useLogout from "./useLogout";
import { useRecoilState } from "recoil";
import authState from "../../../recoil/authState";
import { useQuery } from "@tanstack/react-query";
import getMe from "../../queryFns/me.query";

const useAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const [auth, setAuth] = useRecoilState(authState);

  useQuery({
    queryKey: ['me'],
    queryFn: () => {
      setAuth({
        user: null,
        isPending: true,
      });

      return getMe();
    },
    onSuccess: (data) => {
      setAuth({
        user: data,
        isPending: false,
      });
    },
  });

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt || jwt === 'undefined') {
      return;
    } else {
      const expDate = getJwtExpDate(jwt);

      const isLessThanHour = expDate.getTime() - Date.now() < 1000 * 60 * 60;

      if (isLessThanHour) {
        refreshToken().then((newJwt) => {
          localStorage.setItem('jwt', newJwt);
        });
      }
    }
  }, [location]);
}

export default useAuth;
