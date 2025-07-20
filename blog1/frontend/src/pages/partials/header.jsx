import { useEffect, useState } from "react";
import headerStyles from "../styles/headerStyles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthenticateAdmin } from "../../utl/hooks";

function Header({
  isLoggedIn,
  setIsLoggedIn,
  isAdmin,
  setAdmin,
  loading,
  error,
  setLoading,
  setError,
}) {
  const { authenticateAdmin } = useAuthenticateAdmin(
    setLoading,
    setError,
    setAdmin
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      authenticateAdmin();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAdmin(false);
    navigate("/");
  };
  return (
    <div className={headerStyles.headerContainer}>
      <div className={headerStyles.headerBlogName}>Blog</div>

      {isLoggedIn ? (
        <div>
          <Link to="/" className={headerStyles.headerHomeLink}>
            {" "}
            Home
          </Link>
          <button
            onClick={handleLogout}
            className={headerStyles.headerLoginButton}
          >
            Logout
          </button>
          {isAdmin && (
            <>
              <Link to="/newPost" className={headerStyles.headerNewPost}>
                New Post
              </Link>
              <Link to="/editPosts" className={headerStyles.headerNewPost}>
                Edit Posts
              </Link>
            </>
          )}
        </div>
      ) : (
        <div>
          <Link to="/" className={headerStyles.headerHomeLink}>
            {" "}
            Home
          </Link>
          <Link to="/login" className={headerStyles.headerLogin}>
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
