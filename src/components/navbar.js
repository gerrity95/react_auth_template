import React, {useContext} from 'react';
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { UserContext } from '../Context/user.context';
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [userContext, setUserContext] = useContext(UserContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "user/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      setUserContext(oldValues => {
        return { ...oldValues, details: undefined, token: null }
      })
      window.localStorage.setItem("logout", Date.now())
      navigate('/');
    })
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {process.env.REACT_APP_NAME}
          </Typography>
          {!userContext.token && <>
            <Button component={Link} to="/" variant="contained" disableElevation color="primary">
              Login
            </Button>
            <Button component={Link} to="/register" variant="contained" disableElevation color="primary">
              Register
            </Button>
          </>}
          {userContext.token && <>
            <Button component={Link} to="/" variant="contained" disableElevation color="primary">
              Dashboard
            </Button>
            <Button onClick={logoutHandler} variant="contained" disableElevation color="primary">
              Logout
            </Button>
          </>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}