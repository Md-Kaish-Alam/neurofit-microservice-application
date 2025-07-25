import { useDispatch } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";
import { useContext, useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import { setCredentials } from "./store/authSlice";
import ActivityDetails from "./pages/ActivityDetails";
import { ThemeProvider } from "./providers/theme-provider";

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setIsAuthenticated(true);
    } else {
      dispatch(setCredentials({ token: null, user: null }));
      setIsAuthenticated(false);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div>
          {!isAuthenticated ? (
            <Navbar isAuthenticated={isAuthenticated} login={logIn} />
          ) : (
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                logout={logOut}
                user={tokenData}
              />
              <div>
                <Routes>
                  <Route path="/activities" element={<Home />} />
                  <Route path="/activities/:id" element={<ActivityDetails />} />
                  <Route
                    path="/"
                    element={
                      isAuthenticated && <Navigate to="/activities" replace />
                    }
                  />
                </Routes>
              </div>
            </>
          )}
        </div>
        <Toaster theme="dark" />
      </ThemeProvider>
    </Router>
  );
}

export default App;
