import newPostStyles from "../styles/newPostStyles.module.css";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditPost, getPostById } from "../../utl/hooks";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

function EditPosts() {
  const { loading, setLoading, error, setError } = useOutletContext();
  const navigate = useNavigate();
  const { postId: postIdParam } = useParams();
  const postId = postIdParam;
  const [post, setPost] = useState(null);
    const { getPost } = getPostById(setLoading, setError);
  const [editPostData, setEditPostData] = useState({
    title: "",
    content: "",
    postId: postId,
    image: "",
    publishedStatus: false,
  });

  useEffect(() => {
    const runEffects = async () => {
      const tempPost = await getPost(postId);
      if (!tempPost) {
        setError("Post not found");
        return;
      }

      setPost(tempPost);
      setEditPostData({
        title: tempPost.title,
        content: tempPost.content,
        postId: tempPost.id,
        image: tempPost.imageUrl || "",
        publishedStatus: tempPost.published,
      });
    };

    runEffects();
  },[postId]);
  const { editPost } = useEditPost(setLoading, setError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = await editPost(
      editPostData.title,
      editPostData.content,
      editPostData.postId,
      editPostData.publishedStatus,
      editPostData.image
    );
    if (newPost) {
      setEditPostData({
        title: "",
        content: "",
        imgage: "",
      });
      navigate("/");
    }
  };
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setEditPostData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 if (loading || !post) return <span> Loading...</span>;
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
          value={editPostData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="newPostContent"
          placeholder="Write your post content here..."
          value={editPostData.content}
          onChange={handleChange}
          required
        />

        {post.imageUrl && (
          <div className={newPostStyles.currentImagePreview}>
            <p>Current image:</p>
            <img
              src={post.imageUrl}
              alt="Current Post"
              className={newPostStyles.currentImage}
            />
          </div>
        )}
        <label htmlFor="image">Image (optional)</label>
        <input
          name="image"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e) => {
            setEditPostData({
              ...editPostData,
              image: e.target.files[0],
            });
          }}
        ></input>

        <label htmlFor="publishedStatus">Publish:</label>
        <input
          type="checkbox"
          name="publishedStatus"
          checked={editPostData.publishedStatus}
          onChange={handleChange}
        />
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

export default EditPosts;
