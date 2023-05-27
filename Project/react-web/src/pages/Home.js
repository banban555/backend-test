import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthContext";
import React from "react";

const Home = () => {
  const { isLoggedIn } = React.useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/application");
    } else {
      navigate("/signin");
    }
  }, [isLoggedIn, navigate]);

  return <div></div>;
};

export default Home;
