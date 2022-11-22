import React, {useContext, useCallback, useEffect} from "react"
import { UserContext } from "../Context/user.context"
import { Navigate } from "react-router-dom";
import BasicTable from "../components/basicTable";
import Loader from "./Loader";
import { Container, CssBaseline, Box, Button, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const userColumns = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'username', header: 'Email' },
];

const Welcome = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const theme = createTheme();

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "user", {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, details: data }
        })
      } else {
        if (response.status === 401) {
          console.log(response);
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload()
        } else {
          setUserContext(oldValues => {
            return { ...oldValues, details: null }
          })
        }
      }
    })
  }, [setUserContext, userContext.token])

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails])

  const refetchHandler = () => {
    // set details to undefined so that spinner will be displayed and
    //  fetchUserDetails will be invoked from useEffect
    setUserContext(oldValues => {
      return { ...oldValues, details: undefined }
    })
  }

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="l">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography style={{ marginTop: 20}} component="h1" variant="h5">
          Welcome To Pandaren
        </Typography>
        <Box noValidate sx={{ mt: 1 }}>
        <BasicTable data={[userContext.details]} columns={userColumns} />
        </Box>
      </Box>

    </Container>
  </ThemeProvider>
  )
}

export default Welcome