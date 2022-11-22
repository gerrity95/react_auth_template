import NavBar from "./components/navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Welcome from "./Pages/Welcome";
import NotFound from "./Pages/404";
import { UserContext } from "./Context/user.context";
import PrivateRoute from "./middlewares/privateRoute";
import PublicRoute from "./middlewares/publicRoute";
import React, { useContext, useCallback, useEffect, useState} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate}
    from 'react-router-dom';
import Loader from "./Pages/Loader";

function App() {
  const [userContext, setUserContext] = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const verifyUser = useCallback(() => {
    setLoading(true);
    fetch(process.env.REACT_APP_API_ENDPOINT + "user/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, token: data.token }
        })
        setLoading(false);
      } else {
        setUserContext(oldValues => {
          return { ...oldValues, token: null }
        })
        setLoading(false);
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000)
    }).catch(error => {
      console.log(error);
      setLoading(false)
    })
  }, [setUserContext])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  return !loading ? (
    <Router>
      <NavBar />
      <Routes>
          <Route exact path='/' element={<PublicRoute><Login /> </PublicRoute>}/>
          <Route path='/register' element={<PublicRoute><Register /> </PublicRoute>} />
          <Route exact path='/dashboard' element={<PrivateRoute><Welcome /> </PrivateRoute>}/>
          <Route path='*' element={<NotFound />}/>
      </Routes>
    </Router>
  ) : ( <Loader /> )

  // return userContext.token === null ? (
  //   <Router>
  //     <NavBar />
  //     <Routes>
  //         {/* <Route exact path='/' element={!userContext.token ? <Login/> : <Navigate to='/dashboard'/>}/> */}
  //         <Route path='/' element={<Login/>} />
  //         <Route path='/register' element={<Register/>} />
  //         {/* <Route exact path='/dashboard' element={userContext.token ? <Welcome/> : <Navigate to='/'/>}/> */}
  //         <Route path='*' element={<NotFound />}/>
  //     </Routes>
  //   </Router>
  // ) : userContext.token ? ( 
  //   <Router>
  //     <NavBar />
  //     <Routes>
  //         {/* <Route exact path='/' element={!userContext.token ? <Login/> : <Navigate to='/dashboard'/>}/> */}
  //         <Route path='/' element={<Welcome/>} />
  //         {/* <Route exact path='/dashboard' element={userContext.token ? <Welcome/> : <Navigate to='/'/>}/> */}
  //         <Route path='*' element={<NotFound />}/>
  //     </Routes>
  //   </Router>
  // ) : ( <Loader />)
}

export default App