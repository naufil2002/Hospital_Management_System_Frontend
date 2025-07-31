import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ setIsAdmin }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("isAdmin"); // clear from localStorage
    setIsAdmin(false);                 // update state to re-render UI
    navigate("/admin-login");
  }, [navigate, setIsAdmin]);

  return null;
}

export default Logout;
