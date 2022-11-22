import React, { useState, useContext } from "react"
import { Alert, Container, CssBaseline, Box, Button, TextField, Typography, Checkbox, FormControlLabel, Grid, Link } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Loading from '../components/loading';
import { UserContext } from "../Context/user.context";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const theme = createTheme();

  const validateInputs = props => {
    // ERROR HANDLING FOR MISSING FIELDS
    if (email === "" || password === "") {
      setError("Error: All fields must be filled");
      setLoading(false);
      setIsSubmitting(false);
      email === "" ? setEmailError(true) : setEmailError(false)
      password === "" ? setPasswordError(true) : setPasswordError(false)
      return false;
    }
    return true;
  }

  const formSubmitHandler = e => {
    e.preventDefault()
    setIsSubmitting(true)
    setLoading(true)
    setEmailError(false)
    setPasswordError(false)
    setError("")

    if (!validateInputs()) {
      return;
    }

    const genericErrorMessage = "Something went wrong! Please try again later."

    fetch(process.env.REACT_APP_API_ENDPOINT + "user/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        setLoading(false)
        if (!response.ok) {
          if (response.status === 401) {
            setError("Incorrect email or password.")
          } else {
            setError(genericErrorMessage)
          }
        } else {
          const data = await response.json()
          console.log(data);
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token }
          })
          // navigate('/dashboard');
        }
      })
      .catch(error => {
        console.log(error);
        setIsSubmitting(false)
        setLoading(false)
        setError(genericErrorMessage)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <div className="row">
          <div className="logo">
            <img src='./placeholder_logo.webp' alt="Site Logo" width="200" height="200"/>
          </div>
        </div>
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography style={{ marginTop: 20}} component="h1" variant="h5">
            Welcome To {process.env.REACT_APP_NAME}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={emailError}
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={passwordError}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <Alert style={{marginBottom: 20, marginTop: 10}} severity="error">{error}</Alert>}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              onClick={formSubmitHandler}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {`${isSubmitting ? "Signing In" : "Sign In"}`}
            </Button>
            {loading && <Loading style={{marginBottom: 20}} />}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  )
}

export default Login
