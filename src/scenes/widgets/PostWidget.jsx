import React, { useState, useEffect } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  Send,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  TextField,
  useTheme,
  InputAdornment,
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import Friend from "components/Friend";
import { useDispatch, useSelector } from "react-redux";
import { setPost, incrementHarmfulCommentsCount, deleteUser } from "state";
import { Navigate } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(comments);
  const [mlPrediction, setMlPrediction] = useState(null);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user);
  const loggedInUserId = loggedInUser?._id;
  const loggedInUserFirstName = loggedInUser?.firstName;
  const harmfulCommentsCount = useSelector((state) => state.harmfulCommentsCount);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const patchLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!loggedInUserId || !loggedInUserFirstName) {
      console.error("User not logged in or firstName not found");
      return;
    }
    try {
      console.log("Sending comment to ml server...");
      console.log("Comment being sent:", newComment);

      // Send the new comment to the ML server for analysis
      const mlResponse = await fetch(`http://127.0.0.1:4000/analyze-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment, userId: loggedInUserId }),
      });
      const mlResult = await mlResponse.json();
      console.log("ML Server Response:", mlResult);

      // Send the comment along with the ML prediction to the backend
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: newComment,
          userId: loggedInUserId,
          firstName: loggedInUserFirstName, // Include the firstName here
          mlPrediction: mlResult.prediction,
        }),
      });
      const updatedPost = await response.json();
      console.log("Updated post after comment submit:", updatedPost); // Log the updated post
      dispatch(setPost({ post: updatedPost }));

      // Clear the input box after submitting the comment
      setNewComment("");

      // Update the local state with the new comment and its ML prediction
      const newCommentData = updatedPost.comments[updatedPost.comments.length - 1];
      setMlPrediction(mlResult.prediction);
      setCommentList(updatedPost.comments);

      // If the comment is harmful, increment the global harmful comments count
      if (mlResult.prediction === "Harmful") {
        dispatch(incrementHarmfulCommentsCount({ userId: loggedInUserId }));

        // Check if harmful comments count reaches or exceeds 5
        if ((harmfulCommentsCount[loggedInUserId] || 0) >= 4) {
          await fetch(`http://localhost:3001/users/${loggedInUserId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(deleteUser({ userId: loggedInUserId }));
          setRedirectToLogin(true);
        }
      }
    } catch (error) {
      console.error("Error adding user comment:", error);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/" />;
  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <Box display="flex" alignItems="center" mt="0.25rem">
        <IconButton onClick={patchLike}>
          {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
        </IconButton>
        <Typography>{likeCount}</Typography>
        <IconButton onClick={() => setIsComments(!isComments)}>
          <ChatBubbleOutlineOutlined />
        </IconButton>
        <Typography>{commentList.length}</Typography>
        <IconButton sx={{ marginLeft: "auto" }}>
          <ShareOutlined />
        </IconButton>
      </Box>
      {isComments && (
        <Box mt="0.5rem">
          {commentList.map((comment, i) => (
            <Box key={`comment-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.firstName} - {comment.comment}
                {i === commentList.length - 1 && mlPrediction === "Harmful" && (
                  <React.Fragment>
                    <br />
                    <span style={{ color: "red" }}> This comment has been flagged as {mlPrediction}</span>
                    <br />
                    {`Harmful Comments by ${loggedInUserFirstName}: ${harmfulCommentsCount[comment.userId] || 0}`}
                  </React.Fragment>
                )}
              </Typography>
            </Box>
          ))}
          <Divider />
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            label="Add a comment"
            fullWidth
            variant="outlined"
            sx={{ mt: "1rem" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCommentSubmit}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
