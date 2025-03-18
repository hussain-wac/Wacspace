import { useSetAtom } from "jotai";
import { globalState } from "../jotai/globalState";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
const useAuth = () => {
  const setUser = useSetAtom(globalState);
  const [loading, setLoading] = useState(false);
  const handleGoogleLoginSuccess = (credentialResponse) => {
    setLoading(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      // console.log(decoded);
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      });
    } catch (error) {
      console.error("Failed to decode token:", error);
    } finally {
      setLoading(false);
    }
  };

  return {  loading, handleGoogleLoginSuccess };
};

export default useAuth;