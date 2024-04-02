import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "../../Styles/Pages/pageDetail.css"; // Update the path as needed
import { useAuth } from "../../services/useAuth";
import Navbar from "../../Components/layout/navbar"; // Ensure this path is correct
import PostForm from "../post_item/postForm"; // Make sure you have this component
import Post from "../post_item/post";

const PageDetail = () => {
  const [pageDetails, setPageDetails] = useState({ posts: [], title: "" });
  const [showPostForm, setShowPostForm] = useState(false);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/pages/${id}`
        );
        setPageDetails(result.data);
        setIsFollowing(result.data.followers?.includes(currentUser));
      } catch (error) {
        console.error("Error fetching page details:", error);
      }
    };
    fetchPageDetails();
  }, [id, currentUser]);

  const toggleFollow = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/pages/${id}/toggle-follow`,
        { userId: currentUser } // Sending the userId in the request body
      );

      if (response.status === 200) {
        setIsFollowing(response.data.isFollowing); // Update based on the server's response
        // Optionally, update the local state to reflect the new followers list
        setPageDetails((prevDetails) => ({
          ...prevDetails,
          followers: response.data.isFollowing
            ? [...prevDetails.followers, currentUser]
            : prevDetails.followers.filter((userId) => userId !== currentUser),
        }));
      } else {
        console.error("Failed to toggle follow status");
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  // Format the date in a more readable form
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // To handle post creation
  const handleCreatePost = () => {
    setShowPostForm(!showPostForm); // Toggle the visibility of the PostForm
  };

  // Example function to update likes for a post (adjust as needed)
  const updatePostLikes = (updatedPost) => {
    const updatedPosts = pageDetails.posts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post
    );
    setPageDetails({ ...pageDetails, posts: updatedPosts });
  };

  // Example function to add a comment to a post (adjust as needed)
  const onCommentAdded = (postId, updatedPost) => {
    const updatedPosts = pageDetails.posts.map((post) =>
      post._id === postId ? updatedPost : post
    );
    setPageDetails({ ...pageDetails, posts: updatedPosts });
  };

  const handlePostSubmit = async (content, imageFile, tag) => {
    const formData = new FormData();
    //    formData.append("content", content);
    formData.append("content", content.toString()); // Convert to string to ensure no object is passed
    formData.append("tag", tag); // 'tag' should already be a string based on your form
    formData.append("author", pageDetails.title || "Anonymous"); // Ensure this is correctly set based on your state
    if (imageFile) {
      formData.append("image", imageFile); // Only add if image is selected
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/newpost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure this is correct
          // Do not set 'Content-Type' here, let the browser set it
        },
        body: formData,
      });
      if (response.ok) {
        const newPost = await response.json();
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      } else {
        throw new Error("Failed to create post");
      }
    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <div className={`container-fluid ${styles.container}`}>
      <Navbar />
      <Container>
        <Card className="my-4">
          <Card.Body>
            <Card.Title className={styles.pageTitle}>
              {pageDetails.title || "Page Details"}
            </Card.Title>
            <hr />
            <Row className="my-2">
              <Col md={6} lg={3}>
                <strong>Type:</strong> {pageDetails.type}
              </Col>
              <Col md={6} lg={3}>
                <strong>Date Created:</strong>{" "}
                {formatDate(pageDetails.createdAt)}
              </Col>
              <Col md={6} lg={3}>
                <strong>Created By:</strong> {pageDetails.createdBy}
              </Col>
              {pageDetails.type === "event" && (
                <>
                  <Col md={6} lg={3}>
                    <strong>Event Date:</strong> {formatDate(pageDetails.date)}
                  </Col>
                  <Col md={6} lg={3}>
                    <strong>Event Venue:</strong> {pageDetails.venue}
                  </Col>
                </>
              )}
              {pageDetails.type === "organization" && (
                <Col md={6} lg={3}>
                  <strong>Location:</strong> {pageDetails.location}
                </Col>
              )}
              <Col md={6} lg={3}>
                <strong>Contact Number:</strong> {pageDetails.contactNumber}
              </Col>
            </Row>
            {pageDetails.askForDonations && (
              <Row className="my-2">
                <Col xs={12} sm={6} md={4} lg={2}>
                  <Button
                    variant={isFollowing ? "success" : "primary"}
                    onClick={toggleFollow}
                    className="mr-2"
                    disabled={!currentUser} // Disable button if there is no logged-in user
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="success">Donate</Button>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
        {/* Posts Section */}
        <Row className="my-2">
          <Col xs={12}>
            <Button
              variant="primary"
              onClick={() => setShowPostForm(!showPostForm)}
            >
              {showPostForm ? "Cancel" : "Create Post"}
            </Button>
          </Col>
        </Row>
        {showPostForm && <PostForm onPostSubmit={handlePostSubmit} />}
        {/* Posts Section */}
        <Row>
          <Col>
            <h2 className={styles.postsHeading}>Posts</h2>
            {pageDetails.posts && pageDetails.posts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                author={pageDetails.title} // Ensure these props align with your Post component's expected props
                content={post.content}
                image={post.image}
                deletePost={() => {}}
                likesCount={post.likesCount}
                comments={post.comments}
                updatePostLikes={() => {}}
                onCommentAdded={() => {}}
                currentUser={currentUser}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageDetail;
