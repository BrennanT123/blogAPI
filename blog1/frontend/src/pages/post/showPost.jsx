import postStyles from "../styles/postStyles.module.css";
import Error from "../error/error";
import { Link, Navigate, useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchCommentUserData,
  fetchUserInfo,
  getPostById,
} from "../../utl/hooks";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNewComment } from "../../utl/hooks";

function ShowPost() {
  const { loading, setLoading, error, setError, setAdmin } = useOutletContext();
  const location = useLocation();
  const { postId: postIdParam } = useParams();
  const postId = postIdParam;
  const [post, setPost] = useState(null);
  // const post = location.state?.post;
  const { findUser } = fetchCommentUserData(setLoading, setError);
  const [modifiedComments, setModifiedComments] = useState([]);
  const [newCommentData, setNewCommentData] = useState({
    title: "",
    content: "",
    name: "",
  });
  const [loggedInUser, setLoggedInUser] = useState(false);
  const { getUserInfo } = fetchUserInfo(setLoading, setError, setAdmin);
  const { makeNewComment } = useNewComment(setLoading, setError);
  const navigate = useNavigate();

  const { getPost } = getPostById(setLoading, setError);
  
  useEffect(() => {
    const runEffects = async () => {
      const tempPost = await getPost(postId);
      if (!tempPost) {
        setError("Post not found");
        return;
      }
      console.log(tempPost);
  
      setPost(tempPost);

      const newComments = await Promise.all(
        tempPost.comments.map(async (comment) => {
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
      setModifiedComments(newComments.reverse());

      const getLoggedInName = await getUserInfo();
      if (getLoggedInName) {
        setNewCommentData((prev) => ({
          ...prev,
          name: getLoggedInName,
        }));
        setLoggedInUser(getLoggedInName);
      } else {
        setLoggedInUser(false);
      }
    };

    runEffects();
  }, [postId]);

  const handleChangeComment = (e) => {
    setNewCommentData({
      ...newCommentData,
      [e.target.name]: e.target.value,
    });
  };

  //its not working for guest accounts
  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = newCommentData.content;
    const guestAuthor = newCommentData.name;
    const newComment = await makeNewComment(content, guestAuthor, postId);

    let commentAuthor = "";

    if (!newComment) return;

    if (newComment.comment.guestName) {
      commentAuthor = newComment.comment.guestName;
    } else {
      const findUserResult = await findUser(newComment.comment.authorId);
      console.log(findUserResult);
      commentAuthor = findUserResult.firstName + " " + findUserResult.lastName;
    }
    setModifiedComments((prev) => [
      ...prev,
      {
        ...newComment.comment,
        commentAuthor,
      },
    ]);

    setNewCommentData({
      title: "",
      content: "",
      name: loggedInUser || "",
    });
  };

  if (loading || !post) return <span> Loading...</span>;
  if (error) return <Error />;

  if (!postId) return <span>Post not found.</span>;

  return (
    <div className={postStyles.postContainer}>
      <div className={postStyles.postViewContainer}>
        <h2>{post.title}</h2>
        <span>
          {new Date(post.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <img src={post.imageUrl} alt={`${post.title} image`} className={postStyles.postImg}/>
        <p>{post.content}</p>
      </div>

      <div className={postStyles.postNewComment}>
        <h2 className={postStyles.createNewComment}>Create a new comment</h2>
        <form onSubmit={handleSubmit} className={postStyles.createNewComment}>
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
              <h3> {comment.commentAuthor} said </h3>
              <div className={postStyles.singleCommentTime}>
                at{" "}
                {new Date(comment.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
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
