import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./pages/partials/header";
import mainStyles from "./pages/styles/mainStyles.module.css";
import { useAuthenticateAdmin } from "./utl/hooks";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { authenticateAdmin } = useAuthenticateAdmin(setLoading, setError, setAdmin); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      authenticateAdmin();
    }
  }, []);

  return (
    <div className={mainStyles.websiteContainer}>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isAdmin={isAdmin}
        setAdmin={setAdmin}
        loading={loading}
        error={error}
        setLoading={setLoading}
        setError={setError}
      />
      <Outlet
        context={{
          setIsLoggedIn,
          isAdmin,
          setAdmin,
          loading,
          setLoading,
          error,
          setError,
        }}
      />
    </div>
  );
}

export default App;
