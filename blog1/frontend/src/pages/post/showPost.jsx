import postStyles from "../styles/postStyles.module.css";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { fetchCommentUserData, fetchUserInfo } from "../../utl/hooks";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function ShowPost() {
  const { loading, setLoading, error, setError, setAdmin } = useOutletContext();
  const location = useLocation();
  const post = location.state?.post;
  const { findUser } = fetchCommentUserData(setLoading, setError);
  const [modifiedComments, setModifiedComments] = useState([]);
  const [newCommentData, setNewCommentData] = useState({
    title: "",
    content: "",
    name: "",
  });
  const [loggedInUser, setLoggedInUser] = useState(false);
  const { getUserInfo } = fetchUserInfo(setLoading, setError, setAdmin);

  useEffect(() => {
  const runEffects = async () => {
    const newComments = await Promise.all(
      post.comments.map(async (comment) => {
        let commentAuthor = "guest";
        if (comment.authorId) {
          const findUserResult = await findUser(comment.authorId);
          commentAuthor =
            findUserResult.firstName + " " + findUserResult.lastName;
        } else if (comment.guestName) {
          commentAuthor = comment.guestName;
        }
        return {
          ...comment,
          commentAuthor,
        };
      })
    );
    setModifiedComments(newComments);

    const getLoggedInName = await getUserInfo();
    if (getLoggedInName) {
      setNewCommentData((prev) => ({
        ...prev,
        name: getLoggedInName,
      }));
      setLoggedInUser(getLoggedInName); 
      console.log(getLoggedInName+"here");
    } else {
      setLoggedInUser(false);
    }
  };

  runEffects();
}, [post]);

  const handleChangeComment = (e) => {
    setNewCommentData({
      ...newCommentData,
      [e.target.name]: e.target.value,
    });
  };

  if (!post) return <Error />;
  return (
    <div className={postStyles.postContainer}>
      <div className={postStyles.postViewContainer}>
        <h2>{post.title}</h2>
        <div>created at: {post.createdAt}</div>
        <p>{post.content}</p>
      </div>

      <div className={postStyles.postNewComment}>
        <h2 className={postStyles.createNewComment}>Create a new comment</h2>
        <form action="">
          <label htmlFor="author">Name: </label>
          <input
            type="text"
            id="newCommentName"
            name="name"
            value={newCommentData.name}
            onChange={handleChangeComment}
            required
            disabled={loading || loggedInUser}
          />
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="newCommentTitle"
            name="title"
            value={newCommentData.title}
            onChange={handleChangeComment}
            required
          />

          <label htmlFor="content">Content: </label>
          <textarea
            name="content"
            id="newCommentContent"
            placeholder="Write your comment content here..."
            value={newCommentData.content}
            onChange={handleChangeComment}
            required
          />
          <button
            type="submit"
            className={postStyles.submitButton}
            disabled={loading}
          >
            Submit Comment
          </button>
          {error && <p className={postStyles.errorText}>{error}</p>}
        </form>
      </div>
      <div className={postStyles.commentsContainer}>
        {modifiedComments.map((comment, index) => {
          return (
            <div className={postStyles.singleCommentContainer} key={index}>
              <h3 className={postStyles.singleCommentTitle}>
                {comment.title}{" "}
              </h3>
              <h4>By: {comment.commentAuthor} </h4>
              <div className={postStyles.singleCommentContent}>
                {comment.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShowPost;
