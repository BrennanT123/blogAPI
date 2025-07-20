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


  if (!posts || posts.length === 0) return <span>No posts published.</span>;

  const publishedPosts = posts.filter((post) => post.published);
  console.log(posts);

  return (
    <div className={homeStyles.allPostsContainer}>
      <h1>All Posts</h1>
      {publishedPosts.map((post) => (
        <Link
          to={`/post/${post.id}`}
          state={{ post }}
          className={homeStyles.postContainer}
          key={post.id}
        >
          <h2>{post.title}</h2>
          {post.imageUrl && <img src={post.imageUrl} alt={`${post.title} image`} className={homeStyles.postImg}/>}
          <span>
            {new Date(post.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <p>{post.content.slice(0, 30)}...</p>
        </Link>
      ))}
    </div>
  );
}

export default Home;
