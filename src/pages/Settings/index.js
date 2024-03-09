import React, { useState } from "react";
import "../../Styles/HomePage/settings.css"; // Ensure this path is correct
import BackgroundImage from "../../assets/images/background.jpg"; // Ensure this path is correct

const SettingsPage = () => {
  const [emailPublic, setEmailPublic] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    email: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEmailVisibilityToggle = () => {
    setEmailPublic(!emailPublic);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the submission, e.g., send data to backend
    console.log(profile);
    console.log(`Email is ${emailPublic ? "public" : "private"}`);
  };

  return (
    <div
      className="settings__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="container mt-5 settings-container">
        <div className="image-preview-container text-center">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Profile Preview" className="image-preview" />
          ) : (
            <div className="image-preview">
              <span>No image</span>
            </div>
          )}
        </div>
        <h1 className="mb-4 text-center">Settings</h1>
        <form onSubmit={handleFormSubmit} className="row g-3 bg-white p-4 rounded shadow">
          <div className="mb-3 text-center">
            <label htmlFor="profilePicture" className="form-label">
              Profile Picture:
            </label>
            <input
              className="form-control"
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          {/* Remaining form fields */}
          <div className="mb-3 col-md-6">
            <label htmlFor="username" className="form-label">Username:</label>
            <input type="text" className="form-control" id="username" name="username" value={profile.username} onChange={handleProfileChange} />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" className="form-control" id="email" name="email" value={profile.email} onChange={handleProfileChange} />
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" id="emailPublic" checked={emailPublic} onChange={handleEmailVisibilityToggle} />
              <label className="form-check-label" htmlFor="emailPublic">Make Email Public</label>
            </div>
          </div>
          <div className="mb-3 col-12">
            <label htmlFor="bio" className="form-label">Bio:</label>
            <textarea className="form-control" id="bio" name="bio" value={profile.bio} onChange={handleProfileChange} rows="3"></textarea>
          </div>
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
