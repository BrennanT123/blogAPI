import newPostStyles from "../styles/newPostStyles.module.css";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useNewPost } from "../../utl/hooks";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function NewPosts() {
  const { loading, setLoading, error, setError } = useOutletContext();
  const navigate = useNavigate();
  const [newPostData, setNewPostData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const { makeNewPost } = useNewPost(setLoading, setError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = await makeNewPost(newPostData.title, newPostData.content, newPostData.image);
    if (newPost) {
      setNewPostData({
        title: "",
        content: "",
        image: "",
      });
      navigate("/");
    }
  };
  const handleChange = (e) => {
    setNewPostData({
      ...newPostData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={newPostStyles.newPostContainer}>
      <h2 className={newPostStyles.pageTitle}>Create a New Post</h2>
      <form
        onSubmit={handleSubmit}
        className={newPostStyles.newPostForm}
        method="POST"
      >
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="newPostTitle"
          name="title"
          value={newPostData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="newPostContent"
          placeholder="Write your post content here..."
          value={newPostData.content}
          onChange={handleChange}
          required
        />
        <label htmlFor="image">Image (optional)</label>
            <input name = "image" type="file" accept="image/png, image/jpeg" onChange={(e) =>
              {
                setNewPostData({
                  ...newPostData,
                  image: e.target.files[0],
                })
              }
            }></input>
        <button
          type="submit"
          className={newPostStyles.submitButton}
          disabled={loading}
        >
          Submit Post
        </button>
        {error && <p className={newPostStyles.errorText}>{error}</p>}
      </form>
    </div>
  );
}

export default NewPosts;
