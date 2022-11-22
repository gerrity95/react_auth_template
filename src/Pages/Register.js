import React, { useState, useContext } from "react"
import Loading from "../components/loading";
import { Alert, Container, CssBaseline, Box, Button, TextField, Typography, Checkbox, FormControlLabel, Grid, Link } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UserContext } from "../Context/user.context";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const validateInputs = props => {
    // ERROR HANDLING FOR MISSING FIELDS
    if (email === "" || password === "" || firstName === "" || lastName === "") {
      setError("Error: All fields must be filled");
      setLoading(false);
      setIsSubmitting(false);
      return false;
    }
    return true;
  }

  const formSubmitHandler = e => {
    e.preventDefault()
    setIsSubmitting(true);
    setLoading(true);
    setError("")

    if (!validateInputs()) {
      return;
    }

    const genericErrorMessage = "Something went wrong! Please try again later."

    fetch(process.env.REACT_APP_API_ENDPOINT + "user/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, username: email, password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        setLoading(false)
        if (!response.ok) {
          if (response.status === 401) {
            setError("Invalid email and password combination.")
          } else if (response.status === 500) {
            console.log(response)
            const data = await response.json()
            if (data.message) setError(data.message || genericErrorMessage)
          } else {
            setError(genericErrorMessage)
          }
        } else {
          const data = await response.json()
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token }
          })
        }
      })
      .catch(error => {
        console.log(error);
        setIsSubmitting(false)
        setError(genericErrorMessage)
        setLoading(false)
      })
  }


  const theme = createTheme();

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
            Register with {process.env.REACT_APP_NAME}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={e => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={e => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              {error && <Alert style={{marginBottom: 20, marginTop: 20}} severity="error">{error}</Alert>}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              onClick={formSubmitHandler}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {loading && <Loading style={{marginBottom: 20}} />}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Register
