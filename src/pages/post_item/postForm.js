import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faPoll,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

function PostForm({ onPostSubmit, onPollSubmit }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [selectedSport, setSelectedSport] = useState(""); // Sport selection state

  const sports = ["Soccer", "Basketball", "Tennis", "Baseball", "Cycling"]; // List of sports

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (showPollCreator) {
  //     if (!pollQuestion.trim() || pollOptions.some((option) => !option.trim()))
  //       return;
  //     onPollSubmit({
  //       question: pollQuestion,
  //       options: pollOptions.filter((option) => option.trim()),
  //     });
  //     setShowPollCreator(false);
  //     setPollQuestion("");
  //     setPollOptions(["", ""]);
  //   } else {
  //     if (!content.trim() && !media) return;
  //     console.log({
  //       content,
  //       media,
  //       tag: selectedSport || "No Sport Selected",
  //     }); // Log the data being submitted
  //     onPostSubmit({
  //       content,
  //       media,
  //       tag: selectedSport || "No Sport Selected", // Ensure it's a string
  //     });
  //     setContent("");
  //     setMedia(null);
  //     setSelectedSport(""); // Reset the sport selection
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showPollCreator) {
      if (!pollQuestion.trim() || pollOptions.some((option) => !option.trim()))
        return;
      onPollSubmit({
        question: pollQuestion,
        options: pollOptions.filter((option) => option.trim()),
      });
      setShowPollCreator(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    } else {
      if (!content.trim() && !media) return;
      onPostSubmit(content, media, selectedSport || "No Sport Selected");
      setContent("");
      setMedia(null);
      setSelectedSport(""); // Reset the sport selection
    }
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const removePollOption = (indexToRemove) => {
    setPollOptions(pollOptions.filter((_, index) => index !== indexToRemove));
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <select
        value={selectedSport}
        onChange={(e) => setSelectedSport(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select a Sport</option>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        style={textareaStyle}
      />

      <div style={buttonsContainerStyle}>
        {!showPollCreator && (
          <label
            style={{
              ...fileInputLabelStyle,
              flexGrow: 1,
              marginRight: "8px",
              justifyContent: "center",
            }}
          >
            <FontAwesomeIcon icon={faFileUpload} style={iconStyle} />
            <span style={{ marginLeft: "8px" }}>Upload Image/Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              style={fileInputStyle}
            />
          </label>
        )}

        <button
          type="button"
          onClick={() => setShowPollCreator(!showPollCreator)}
          style={{ ...buttonStyle, width: showPollCreator ? "100%" : "49%" }}
        >
          {showPollCreator ? (
            "Back to Post"
          ) : (
            <>
              <FontAwesomeIcon icon={faPoll} style={iconStyle} /> Create Poll
            </>
          )}
        </button>
      </div>

      {showPollCreator ? (
        <>
          <input
            type="text"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Poll question..."
            style={inputStyle}
          />
          {pollOptions.map((option, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...pollOptions];
                  newOptions[index] = e.target.value;
                  setPollOptions(newOptions);
                }}
                placeholder={`Option ${index + 1}`}
                style={{ ...inputStyle, flex: 1 }}
              />
              {pollOptions.length > 2 && (
                <button
                  onClick={() => removePollOption(index)}
                  style={{
                    ...buttonStyle,
                    marginLeft: "10px",
                    backgroundColor: "#dc3545",
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addPollOption}
            style={{ ...buttonStyle, marginTop: "10px" }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Option
          </button>
        </>
      ) : null}

      <button type="submit" style={submitButtonStyle}>
        {showPollCreator ? "Post Poll" : "Post"}
      </button>
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "20px",
};

const textareaStyle = {
  width: "100%",
  height: "100px",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  resize: "none", // Users can't resize the textarea
};

const fileInputStyle = {
  display: "none", // Hide the default file input
};

const fileInputLabelStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  padding: "10px",
  fontSize: "16px",
  background: "#f2f2f2",
  borderRadius: "8px",
  cursor: "pointer",
};

const submitButtonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  background: "#007bff",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%", // Make input take up the full width of its container
  padding: "8px 12px", // Add some padding inside the input for spacing
  margin: "8px 0", // Add some margin outside the input for spacing
  borderRadius: "4px", // Add rounded corners to the input
  border: "1px solid #ddd", // Add a light border to the input
  fontSize: "16px", // Increase the font size for better readability
};

const labelTextStyle = {
  marginLeft: "8px", // Space out label text from the icon
  fontSize: "16px", // Match font size with the input for consistency
  verticalAlign: "middle", // Align the text vertically with the icon
};

const buttonStyle = {
  backgroundColor: "#007bff", // Example button color, you can change it
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px", // Adjust spacing as needed
};

const buttonsContainerStyle = {
  display: "flex",
  justifyContent: "space-between", // Spread the buttons across the container
  marginTop: "10px",
};

// Update the buttonStyle to match the modern look of the buttons in the image
const updatedButtonStyle = {
  backgroundColor: "#007bff", // Example: a blue background
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  width: "48%", // Set width to occupy half of the container minus a little for margin
};

// Ensure the FontAwesomeIcon is styled to match the button text
const iconStyle = {
  marginRight: "5px", // Adds some space between the icon and the label
};
export default PostForm;
