import config from "../config";
import authFetch from "./helpers/authFetch";

const refreshToken = async () => {
  const response = await authFetch(`${config.baseUrl}/auth/refresh`);
  const json = await response.json();

  return json.token;
}

export default refreshToken;
