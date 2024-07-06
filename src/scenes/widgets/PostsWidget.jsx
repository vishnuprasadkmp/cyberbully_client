import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(true);
  const loggedInUserId = useSelector((state) => state.user._id);

  const checkUserExists = async (userId) => {
    try {
      const response = await fetch(`https://cyberbully-server.onrender.com/users/${userId}`, {
        // const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.ok;
    } catch (error) {
      console.error(`Error checking user existence: ${error.message}`);
      return false;
    }
  };

  const deletePostsByUser = async (userId) => {
    try {
      await fetch(`https://cyberbully-server.onrender.com/posts/user/${userId}`, {
        // await fetch(`http://localhost:3001/posts/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Deleted posts for user ${userId}`);
    } catch (error) {
      console.error(`Error deleting posts: ${error.message}`);
    }
  };

  const deleteCommentsByUser = async (userId) => {
    try {
      await fetch(`https://cyberbully-server.onrender.com/comments/user/${userId}`, {
        // await fetch(`http://localhost:3001/comments/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`Deleted comments for user ${userId}`);
    } catch (error) {
      console.error(`Error deleting comments: ${error.message}`);
    }
  };

  const fetchAndFilterPosts = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      const userIds = new Set(data.map(post => post.userId)); // Extract unique user IDs

      for (const userId of userIds) {
        const userExists = await checkUserExists(userId);
        if (!userExists) {
          await deletePostsByUser(userId);
          await deleteCommentsByUser(userId);
          console.log(`Deleted posts and comments for non-existent user ${userId}`);
        }
      }

      const validPosts = data.filter(post => userIds.has(post.userId));
      dispatch(setPosts({ posts: validPosts }));
    } catch (error) {
      console.error(`Error fetching and filtering posts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to set flag indicating updates are needed on next login
  const setUpdateNeededFlag = () => {
    localStorage.setItem("updatePostsOnLogin", "true");
  };

  // Function to check and apply updates on next login
  const applyUpdatesOnNextLogin = async () => {
    const updateNeeded = localStorage.getItem("updatePostsOnLogin") === "true";
    if (updateNeeded) {
      setLoading(true);
      if (isProfile) {
        await fetchAndFilterPosts(`https://cyberbully-server.onrender.com/posts/${userId}/posts`);
        // await fetchAndFilterPosts(`http://localhost:3001/posts/${userId}/posts`);
      } else {
        await fetchAndFilterPosts("https://cyberbully-server.onrender.com/posts");
        // await fetchAndFilterPosts("http://localhost:3001/posts");
      }
      localStorage.removeItem("updatePostsOnLogin"); // Clear the flag after applying updates
    }
    setLoading(false);
  };

  useEffect(() => {
    applyUpdatesOnNextLogin();
  }, []); // Run once on component mount

  useEffect(() => {
    setUpdateNeededFlag(); // Set the flag whenever updates are needed
  }, [userId, isProfile, token]);

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  return (
    <>
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.slice().reverse().map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )
      ) : (
        <p>No posts available</p>
      )}
    </>
  );
};

export default PostsWidget;
