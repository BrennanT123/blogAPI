import loginStyles from "../styles/loginStyles.module.css";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useLoginUser } from "../../utl/hooks";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useAuthenticateAdmin } from "../../utl/hooks";

function LoginPage() {
  const { loading, setLoading, error, setError, setIsLoggedIn, setAdmin } =
    useOutletContext();
  const { loginUser } = useLoginUser(setLoading, setError);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const success = await loginUser(email, password);
    if (success) {
      setIsLoggedIn(true);
      const { authenticateAdmin } = useAuthenticateAdmin(
        setLoading,
        setError,
        setAdmin
      );
      await authenticateAdmin();
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={loginStyles.loginForm}>
      <label htmlFor="loginEmail">Email: </label>
      <input type="email" name="email" id="loginEmail" required />
      <label htmlFor="loginPassword">Password: </label>
      <input type="password" name="password" id="loginPassword" required />
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <p>{error}</p>}
      <Link to="/register" className={loginStyles.registerLink}>
        Register
      </Link>
    </form>
  );
}

export default LoginPage;
