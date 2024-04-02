import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import styles from "../../Styles/Pages/pageDetail.css"; // Update the path as needed
import { useAuth } from "../../services/useAuth";
import Navbar from "../../Components/layout/navbar"; // Ensure this path is correct

const PageDetail = () => {
  const [pageDetails, setPageDetails] = useState({});
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

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
        <Row>
          <Col>
            <h2 className={styles.postsHeading}>Posts</h2>
            {pageDetails.posts &&
              pageDetails.posts.map((post) => (
                <Card className="mb-3" key={post._id}>
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageDetail;
