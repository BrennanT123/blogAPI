import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Error from "./pages/error/error.jsx";
import ShowPost from "./pages/post/showPost.jsx";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/home/home.jsx";
import LoginPage from "./pages/login/login.jsx";
import NewPosts from "./pages/newpost/newPost.jsx";
import Register from "./pages/register/register.jsx";
import AllPosts from "./pages/allPosts/editPosts.jsx";
import EditPosts from "./pages/editPost/editpost.jsx";
import "../src/App.css"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "post/:postId", element: <ShowPost /> },
      { path: "login", element: <LoginPage /> },
      { path: "newPost", element: <NewPosts /> },
      {path: "register", element: <Register />},
      {path: "editPosts", element: <AllPosts />},
      {path: "editPosts/:postId",element: <EditPosts />}
    ],
  },
]);

//YOu still need to make it so you can create posts and comments
//Also make every page look pretty
//Also make it so only the admin can make new posts   
//Also add the ability to hide posts and make a place where you can edit all your posts to do that


//YOu can now make posts and its protected for admins only
//but you still need to make it so the new posts button does not show up for non admins

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
