import registerStyles from "../styles/registerStyles.module.css";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRegisterUser } from "../../utl/hooks";
import { useOutletContext } from "react-router-dom";

function Register() {
  const { loading, setLoading, error, setError } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_email: "",
    password: "",
    confirmed_password: "",
    first_name: "",
    last_name: "",
  });

  const { registerUser } = useRegisterUser(setLoading, setError);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = await registerUser(formData);
    if (newUser) {
      setFormData({
        user_email: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
      });

      navigate("/login");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={registerStyles.registerForm}>
      <h2>Create an Account</h2>

      <label htmlFor="first_name">First Name</label>
      <input
        type="text"
        id="first_name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />

      <label htmlFor="last_name">Last Name</label>
      <input
        type="text"
        id="last_name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />

      <label htmlFor="user_email">Email</label>
      <input
        type="email"
        id="user_email"
        name="user_email"
        value={formData.user_email}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <label htmlFor="confirm_password">Password</label>
      <input
        type="password"
        id="confirm_password"
        name="confirm_password"
        value={formData.comfirmed_password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        Register
      </button>
      {error && <p className={registerStyles.errorText}>{error}</p>}
    </form>
  );
}

export default Register;
