import React, { useMemo, useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { themeSettings } from "./theme";
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Outlet,
  Routes,
} from "react-router-dom";
import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import Products from "./scenes/products";
import Customers from "./scenes/customers";
import Transactions from "./scenes/transactions";
import Geography from "./scenes/geography";
import Overview from "./scenes/overview";
import Daily from "./scenes/daily";
import Monthly from "./scenes/monthly";
import Breakdown from "./scenes/breakdown";
import Admin from "./scenes/admin";
import Performance from "./scenes/performance";
import Login from "./scenes/login";
import { AuthClient } from "@dfinity/auth-client";

import { UserContext } from "./UserContext";
import { useAuth } from "./hooks";
import {
  canisterId,
  createActor,
} from "../../declarations/tswaanda_backend/index";

function App() {
  const [session, setSession] = useState(null);
  const { login, isLoggedIn } = useAuth(session, setSession);
  const [authorized, setAuthorized] = useState(null);

  const getRole = async () => {
    const authClient = await AuthClient.create();

    if (await authClient.isAuthenticated()) {
      const identity = await authClient.getIdentity();
      const userPrincipal = identity._principal.toString();
      console.log(userPrincipal);
      const Actor = createActor(canisterId, {
        agentOptions: {
          identity,
        },
      });
      try {
        const role = await Actor.my_role();
        if (role === "null") {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
        console.log("User role: ", role);
      } catch (error) {
        setAuthorized(false)
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (await isLoggedIn()) {
        setSession(true);
      } else {
        setSession(false);
      }
    };
    checkAuth();
  }, [isLoggedIn]);

  useEffect(() => {
    if (session) {
      getRole();
    }
  }, [session]);

  const ProtectedRoutes = () => {
    if (session && authorized) {
      return <Outlet />;
    } else if (session == false) {
      return <Navigate to="/login" />;
    } else if (session && authorized === false) {
      return <h3>You are unauthorized</h3>;
    } else if (session === null || authorized === null) {
      return <h3>Loading...</h3>;
    }
  };

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <UserContext.Provider value={{ session, setSession }}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/breakdown" element={<Breakdown />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/performance" element={<Performance />} />
                </Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
