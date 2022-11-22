import { UserContext } from "../Context/user.context";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const userIsLogged = userContext.token;

  if (userIsLogged) {
     return <Navigate to='/dashboard'/>;
  }
  return children;
};

export default PublicRoute