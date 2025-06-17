import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_LINK } from "./constants";

export const useFetchPosts = (setLoading, setError) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_LINK}/posts`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);

        if (err.response.data.errors) {
          const messages = err.response.data.errors
            .map((e) => e.message)
            .join("\n");
          setError(messages);
        } else {
          setError("Error fetching posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { data };
};

export const useLoginUser = (setLoading, setError) => {
  const [user, setUser] = useState(null);

  //login user hook
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_LINK}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      setUser({ email });

      setLoading(false);
      return true;
    } catch (err) {
      if (err.response.data.errors) {
        const messages = err.response.data.errors
          .map((e) => e.messages)
          .join("\n");
        console.log(err.response.data.errors);
        setError(messages);
      } else {
        setError("Login failed.");
      }
      setLoading(false);
      return false;
    }
  };

  return { user, loginUser };
};

//Used to hide admin routes.
//Routes are still accessible to non admin users, so the
//routes are also protected on the backend from nonverified users
export const useAuthenticateAdmin = (setLoading, setError, setAdmin) => {
  const authenticateAdmin = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_LINK}/auth/authenticateAdmin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { isAdmin } = response.data;

      setAdmin(isAdmin);
    } catch (err) {
      console.log(err);
      const messages =
        err.response?.data?.errors?.map((e) => e.message).join("\n") ||
        "Admin Authentication failed.";
      setError(messages);
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { setAdmin, authenticateAdmin };
};

export const fetchUserInfo = (setLoading, setError, setAdmin) => {
  const getUserInfo = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_LINK}/users/getLoggedInName`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name } = response.data;
      return name;
    } catch (err) {
      if (err.response.data.errors) {
        const messages = err.response.data.errors
          .map((e) => e.message)
          .join("\n");
        setError(messages);
      } else {
        setError("Server error.");
      }

      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { getUserInfo };
};

export const useRegisterUser = (setLoading, setError) => {
  const [newUser, setNewUser] = useState(null);

  const registerUser = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_LINK}/users`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_email: formData.user_email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });
      setNewUser(response.data);
      return response.data;
    } catch (err) {
      if (err.response.data.errors) {
        const messages = err.response.data.errors
          .map((e) => e.message)
          .join("\n");
        setError(messages);
      } else {
        setError("Registration failed.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { registerUser };
};

export const useNewPost = (setLoading, setError) => {
  const [newPost, setNewPost] = useState(null);
  const makeNewPost = async (title, content) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_LINK}/posts/newPost`,
        {
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewPost(response.data);

      return response.data;
    } catch (err) {
      console.log(err);
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors
          .map((e) => e.message)
          .join("\n");
        setError(messages);
      } else if (err.message) {
        const messages = err.message;
        setError(messages);
      } else {
        setError("Could not make new post.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { makeNewPost };
};

export const fetchCommentUserData = (setLoading, setError) => {
  const findUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_LINK}/users/postUserData`, {
        id: userId,
      });
      return response.data;
    } catch (err) {
      if (err.response.data.errors) {
        const messages = err.response.data.errors
          .map((e) => e.message)
          .join("\n");
        setError(messages);
      } else {
        setError("Server error.");
      }
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { findUser };
};
