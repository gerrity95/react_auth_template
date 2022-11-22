import { UserContext } from "../Context/user.context";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [userContext, setUserContext] = useContext(UserContext);
  const userIsLogged = userContext.token;

  if (!userIsLogged) {
     return <Navigate to='/'/>;
  }
  return children;
};

export default PrivateRoute