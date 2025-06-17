import homeStyles from "../styles/homeStyles.module.css";
import { useFetchPosts } from "../../utl/hooks";
import Error from "../error/error";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function Home() {
    const { loading, setLoading, error, setError } = useOutletContext();
  const { data: posts } = useFetchPosts(setLoading, setError);

  if (loading) return <span> Loading...</span>;
  if (error) return <Error />;
  if (!posts || posts.length === 0) return <span>No posts available.</span>;
  return (
    <div className={homeStyles.allPostsContainer}>
      <h1>All Posts</h1>
      {posts.map((post) => (
        <Link
          to="/posts"
          state={{ post }}
          className={homeStyles.postContainer}
          key={post.id}
        >
          <h2>{post.title}</h2>
          <span>{post.createdAt}</span>
          <p>{post.content.slice(0, 30)}...</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;
