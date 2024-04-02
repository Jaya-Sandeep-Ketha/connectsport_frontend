import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import CreatePage from "./createPage"; // Ensure this path is correct
import styles from "../../Styles/Pages/page.css"; // Ensure the path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../Components/layout/navbar"; // Ensure this path is correct

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/pages`
        );
        setPages(result.data);
      } catch (error) {
        console.error("There was an error fetching the pages:", error);
      }
    };

    fetchPages();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className={`container-fluid ${styles.container}`}>
      <Navbar />
      <div className={`card ${styles.cardCustom}`}>
        <div className={`card-body ${styles.cardBody}`}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className={`card-title ${styles.cardTitle}`}>Explore Pages</h3>
            <Button
              variant="primary"
              onClick={handleShowModal}
              className="mb-2" // You can remove mb-3 and add mb-2 for slightly less bottom margin if needed
            >
              Create Page
            </Button>
          </div>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Create a New Page</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreatePage onClose={handleCloseModal} />
            </Modal.Body>
          </Modal>

          {/* Pages list */}
          {pages.map((page) => (
            <div key={page._id} className={styles.pageItem}>
              <div className={styles.pageHeader}>
                <h2 className={styles.pageTitle}>
                  <Link to={`/pages/${page._id}`} className={styles.pageLink}>
                    {page.title || "Untitled Page"}
                  </Link>
                </h2>
              </div>
              <p className={styles.pageDescription}>{page.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PagesList;
