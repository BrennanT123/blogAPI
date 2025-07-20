import homeStyles from "../styles/homeStyles.module.css";
import { useFetchPosts, useDeletePost } from "../../utl/hooks";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";

function AllPosts() {
  const navigate = useNavigate();
  const { loading, setLoading, error, setError } = useOutletContext();
  const { data: posts } = useFetchPosts(setLoading, setError);
  const { deletePostById } = useDeletePost(setLoading, setError);

  if (loading) return <span> Loading...</span>;
  if (error) return <Error />;
  if (!posts || posts.length === 0) return <span>No posts available.</span>;

  const deletePost = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return true;
    await deletePostById(id);
    navigate("/");
  };
  return (
    <div className={homeStyles.allPostsContainer}>
      <h1>Edit posts</h1>
      {posts.map((post) => (
        <div className={homeStyles.postContainer} key={post.id}>
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
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={`${post.title} image`}
              className={homeStyles.postImg}
            />
          )}
          <p>{post.content.slice(0, 30)}...</p>

          <Link to={`/editPosts/${post.id}`} state={{ post }}>
            Edit Post
          </Link>
          <button onClick={() => deletePost(post.id)}>Delete post</button>
        </div>
      ))}
    </div>
  );
}

export default AllPosts;
