import React, { useEffect, useState } from "react";

const Home = () => {
  const [allowedButtons, setAllowedButtons] = useState([]);

  // Fetch allowed buttons from sessionStorage on component mount
  useEffect(() => {
    const accessData = sessionStorage.getItem("access");
    if (accessData) {
      setAllowedButtons(JSON.parse(accessData)); // Convert from string to array
    }
  }, []);

  const handleButtonClick = (buttonNumber) => {
    if (allowedButtons.includes(buttonNumber)) {
      alert(`ACCESS GRANTED: Button ${buttonNumber}`);
    } else {
      alert(`ACCESS DENIED: You do not have access to Button ${buttonNumber}`);
    }
  };

  // when user clicks "request access" button, add userID,
  const handleButtonClick2 = () => {

  }

  return (
    <div style={styles.container}>
      <h1>Home Page</h1>
      <div style={styles.buttonContainer}>
        {[...Array(8)].map((_, index) => (
          <button
            key={index}
            style={{
              ...styles.button,
              backgroundColor: allowedButtons.includes(index + 1) ? "#007BFF" : "#888",
            }}
            onClick={() => handleButtonClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div style={styles.buttonContainer}>
        <button>Request Access</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    cursor: "pointer",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "0.3s",
  },
};

export default Home;
