import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  harmfulCommentsCount: {}, // New state for harmful comments count
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    incrementHarmfulCommentsCount: (state, action) => {
      const { userId } = action.payload;
      state.harmfulCommentsCount[userId] = (state.harmfulCommentsCount[userId] || 0) + 1;
    },
    deleteUser: (state, action) => {
      const { userId } = action.payload;
      state.posts = state.posts.filter(post => post.userId !== userId);
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, incrementHarmfulCommentsCount, deleteUser } =
  authSlice.actions;
export default authSlice.reducer;
