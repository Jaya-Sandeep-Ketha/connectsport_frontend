import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from '../../Styles/Pages/page.css'; // Import as a module

const PageDetail = () => {
  const [page, setPage] = useState(null);
  const [error, setError] = useState(''); // State for storing any error messages
  const { id } = useParams();

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const result = await axios.get(`/api/pages/${id}`);
        setPage(result.data);
      } catch (error) {
        setError('Failed to load page details.'); // Set an error message
        console.error(error); // Log the error to the console
      }
    };

    fetchPageDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>; // Render the error message if there is an error
  }

  if (!page) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageDetail}>
      <h1 className={styles.pageName}>{page.name}</h1>
      <p className={styles.pageDescription}>{page.description}</p>
      {/* Here we would list out all the content the page has posted */}
      <div className={styles.pageContent}>
        {/* Content components would go here */}
      </div>
    </div>
  );
};

export default PageDetail;
