import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Home.css";
import "./Modals.css";

const API_BASE_URL = "http://localhost:5000";

function formatNum(n) {
  if (!n) return "0";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}


function Post({ post, user, onVote, onSave, onDeletePost }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [activeCommentMenu, setActiveCommentMenu] = useState(null);

  const isSaved = post.savedBy?.includes(user?._id);
  const isAuthor = post.author?._id === user?._id || post.author === user?._id;

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await API.get(`/comments/post/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await API.post("/comments", { text: newComment, post: post._id });
      // The backend returns the new comment without populate author, but we have the user
      const newComm = { ...res.data, author: { username: user.username, _id: user._id } };
      setComments([newComm, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      setActiveCommentMenu(null);
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <article className="post-card" id={`post-${post._id}`}>
      <div className="vote-col">
        <button
          className="vote-btn up"
          onClick={() => onVote(post._id, "up")}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span className="vote-count">{formatNum(post.upvotes - post.downvotes)}</span>
        <button
          className="vote-btn down"
          onClick={() => onVote(post._id, "down")}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>

      <div className="post-content">
        <div className="post-header-row">
          <div className="post-meta">
            <span className="subreddit">r/{post.community?.name || "all"}</span>
            <span className="meta-dot">·</span>
            <span className="post-time">Posted by u/{post.author?.username} · {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          
          {isAuthor && (
            <div className="menu-container">
              <button 
                className="three-dot-btn" 
                onClick={() => setShowPostMenu(!showPostMenu)}
                aria-label="Post actions"
              >
                •••
              </button>
              {showPostMenu && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item delete" 
                    onClick={() => {
                      onDeletePost(post._id);
                      setShowPostMenu(false);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <h2 className="post-title">{post.title}</h2>
        
        {post.imageUrl && (
          <img 
            src={`${API_BASE_URL}${post.imageUrl}`} 
            alt={post.title} 
            className="post-image" 
          />
        )}

        <p className="post-body">{post.content}</p>
        
        <div className="post-actions">
          <button className="action-btn" onClick={handleToggleComments}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            Comments
          </button>
          <button className="action-btn" onClick={handleShare}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
            {copied ? "Copied!" : "Share"}
          </button>
          <button 
            className={`action-btn ${isSaved ? "active" : ""}`} 
            onClick={() => onSave(post._id)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        {showComments && (
          <div className="comments-section">
            <form className="comment-form" onSubmit={handleAddComment}>
              <input
                className="comment-input"
                type="text"
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn-comment" type="submit">Comment</button>
            </form>

            {loadingComments ? (
              <p>Loading comments...</p>
            ) : (
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-meta">
                          <span className="comment-author">u/{comment.author?.username}</span>
                          <span className="comment-time">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {(comment.author?._id === user?._id || comment.author === user?._id) && (
                          <div className="menu-container">
                            <button 
                              className="comment-menu-btn" 
                              onClick={() => setActiveCommentMenu(activeCommentMenu === comment._id ? null : comment._id)}
                            >
                              •••
                            </button>
                            {activeCommentMenu === comment._id && (
                              <div className="dropdown-menu mini">
                                <button 
                                  className="dropdown-item delete" 
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="comment-text">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [sort, setSort] = useState("hot");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  const [postForm, setPostForm] = useState({ title: "", content: "", community: "" });
  const [postImage, setPostImage] = useState(null);
  const [communityForm, setCommunityForm] = useState({ name: "", description: "" });

  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await API.get("/posts", {
        params: { sort, search: searchTerm }
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  }, [sort, searchTerm]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [userRes, commRes] = await Promise.all([
          API.get("/auth/profile"),
          API.get("/communities")
        ]);
        setUser(userRes.data.user);
        setCommunities(commRes.data);
        await fetchPosts();
      } catch (err) {
        console.error("Initialization failed", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate, fetchPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) fetchPosts();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchTerm, fetchPosts, loading]);

  useEffect(() => {
    if (!loading) fetchPosts();
  }, [sort, fetchPosts, loading]);

  const handleVote = async (postId, type) => {
    try {
      const res = await API.patch(`/posts/${postId}/vote`, { type });
      setPosts(posts.map(p => p._id === postId ? { ...p, upvotes: res.data.upvotes, downvotes: res.data.downvotes } : p));
    } catch (err) {
      console.error("Voting failed", err);
    }
  };

  const handleSave = async (postId) => {
    try {
      const res = await API.patch(`/posts/${postId}/save`);
      setPosts(posts.map(p => p._id === postId ? { ...p, savedBy: res.data.savedBy } : p));
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error("Delete failed", err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", postForm.title);
      formData.append("content", postForm.content);
      formData.append("community", postForm.community);
      if (postImage) {
        formData.append("image", postImage);
      }

      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setPosts([res.data, ...posts]);
      setShowPostModal(false);
      setPostForm({ title: "", content: "", community: "" });
      setPostImage(null);
    } catch (err) {
      console.error("Create post failed", err);
      alert(err.response?.data?.message || "Failed to create post");
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/communities", communityForm);
      setCommunities([...communities, res.data]);
      setShowCommunityModal(false);
      setCommunityForm({ name: "", description: "" });
    } catch (err) {
      console.error("Create community failed", err);
      alert(err.response?.data?.message || "Failed to create community");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading Reddit...</div>;

  return (
    <div className="home-page">
      <nav className="navbar" id="main-navbar">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <svg className="nav-reddit-icon" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#FF4500"/>
              <path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.07 2.13.45a1 1 0 101.07-1.04 1 1 0 00-.96.68l-2.38-.5a.27.27 0 00-.32.2l-.73 3.43a7.14 7.14 0 00-3.83 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.55-1.54zM7.27 11a1 1 0 111 1 1 1 0 01-1-1zm5.58 2.65a3.57 3.57 0 01-2.85.87 3.57 3.57 0 01-2.85-.87.2.2 0 01.28-.28 3.21 3.21 0 002.57.69 3.21 3.21 0 002.57-.69.2.2 0 01.28.28zm-.14-1.65a1 1 0 111-1 1 1 0 01-1 1z" fill="white"/>
            </svg>
            <span className="nav-brand">reddit</span>
          </div>

          <div className="nav-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#8b949e"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
            <input
              id="search-input"
              className="search-input"
              type="text"
              placeholder="Search Reddit"
              aria-label="Search Reddit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="nav-right">
            {user && (
              <div className="nav-user">
                <div className="avatar" aria-label="User avatar">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <span className="nav-username">{user.username || "User"}</span>
              </div>
            )}
            <button id="logout-btn" className="btn-logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <div className="home-layout">
        <main className="feed" id="post-feed">
          <div className="sort-bar">
            {["hot", "new", "top", "rising"].map((s) => (
              <button
                key={s}
                id={`sort-${s}`}
                className={`sort-btn ${sort === s ? "active" : ""}`}
                onClick={() => setSort(s)}
              >
                {s === "hot" && "🔥"} {s === "new" && "✨"} {s === "top" && "📈"} {s === "rising" && "🚀"}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="posts-list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post 
                  key={post._id} 
                  post={post} 
                  user={user} 
                  onVote={handleVote} 
                  onSave={handleSave} 
                  onDeletePost={handleDeletePost}
                />
              ))
            ) : (
              <div className="empty-feed">
                <p>No posts found. Try searching for something else or create a post!</p>
              </div>
            )}
          </div>
        </main>

        <aside className="sidebar" id="sidebar">
          <div className="sidebar-card" id="community-card">
            <div className="sidebar-card-header">
              <div className="community-banner"></div>
              <div className="community-info">
                <div className="community-avatar">r/</div>
                <div>
                  <h3 className="community-name">Home Feed</h3>
                  <p className="community-desc">Your personalized Reddit feed.</p>
                </div>
              </div>
            </div>
            <div className="community-stats">
              <div className="stat"><strong>{communities.length}</strong><span>Communities</span></div>
              <div className="stat"><strong>{posts.length}</strong><span>Posts</span></div>
            </div>
            <button
              id="create-post-btn"
              className="btn-create-post"
              onClick={() => setShowPostModal(true)}
            >
              + Create Post
            </button>
            <button
              id="create-community-btn"
              className="btn-create-community"
              onClick={() => setShowCommunityModal(true)}
            >
              Create Community
            </button>
          </div>

          <div className="sidebar-card" id="rules-card">
            <h3 className="sidebar-title">Reddit Rules</h3>
            <ol className="rules-list">
              <li>Remember the human</li>
              <li>Behave like you would in real life</li>
              <li>Look for the original source</li>
              <li>Search before posting</li>
              <li>Read the community rules</li>
            </ol>
          </div>
        </aside>
      </div>

      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowPostModal(false)}>&times;</button>
            <h2 className="modal-title">Create a post</h2>
            <form className="modal-form" onSubmit={handleCreatePost}>
              <div className="modal-group">
                <label className="modal-label">Community</label>
                <select
                  className="modal-select"
                  required
                  value={postForm.community}
                  onChange={(e) => setPostForm({ ...postForm, community: e.target.value })}
                >
                  <option value="">Select a community</option>
                  {communities.map(c => (
                    <option key={c._id} value={c._id}>r/{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-group">
                <label className="modal-label">Title</label>
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Title"
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                />
              </div>
              <div className="modal-group">
                <label className="modal-label">Content</label>
                <textarea
                  className="modal-textarea"
                  placeholder="Text (optional)"
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-group">
                <label className="modal-label">Upload Photo</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setPostImage(e.target.files[0])}
                  className="modal-input"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCommunityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCommunityModal(false)}>&times;</button>
            <h2 className="modal-title">Create a community</h2>
            <form className="modal-form" onSubmit={handleCreateCommunity}>
              <div className="modal-group">
                <label className="modal-label">Name</label>
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Community Name"
                  required
                  value={communityForm.name}
                  onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
                />
              </div>
              <div className="modal-group">
                <label className="modal-label">Description</label>
                <textarea
                  className="modal-textarea"
                  placeholder="Description"
                  required
                  value={communityForm.description}
                  onChange={(e) => setCommunityForm({ ...communityForm, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCommunityModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
