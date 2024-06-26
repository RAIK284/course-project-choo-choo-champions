import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import NavBar from "../universal/NavBar";
import Background from "../universal/Background";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Profile.css";

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState('');
  // Stretch Goal: Accessibility for Colorblind Individuals
  const [colorblind, setColorblind] = useState(() => {
    const storedColorblind = sessionStorage.getItem("colorblind");
    return storedColorblind ? JSON.parse(storedColorblind) : false;
  });
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUsername = sessionStorage.getItem("username");
    const storedEmail = sessionStorage.getItem("email");
    if (!token || !storedUsername || !storedEmail) {
      window.location.href = "/";
    } else {
      setUsername(storedUsername);
      setEmail(storedEmail);
      fetchUserDetails(token, storedUsername);
      fetchProfileImage(storedUsername);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const storage = getStorage();

  const fetchUserDetails = async (token, username) => {
    try {
      const response = await axios.get(
        `https://choochoochampionsapi.azurewebsites.net/user/Profile/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = response.data;
      setEmail(userData.email);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error fetching user details. Please try again.");
      window.location.href = "/";
    }
  };

  const fetchProfileImage = async (username) => {
    try {
      const pathReference = ref(storage, username);
      const url = await getDownloadURL(pathReference);
      setProfileImage(url);
    } catch (error) {
      console.error("Error fetching user image:", error);
      setProfileImage("https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Thomas_Tank_Engine_1.JPG/220px-Thomas_Tank_Engine_1.JPG");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, username);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Profile Image Changed');
    });
    setProfileImage(URL.createObjectURL(file));
  };

  const handleColorblindToggle = () => {
    const updatedColorblind = !colorblind; // Toggle the colorblind state
    setColorblind(updatedColorblind); // Update the colorblind state
    sessionStorage.setItem("colorblind", updatedColorblind); // Store the updated state in sessionStorage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUsername = sessionStorage.getItem("username");
    const currentEmail = sessionStorage.getItem("email");

    if (username === currentUsername && email === currentEmail) {
      return;
    }
    e.target.querySelector('button[type="submit"]').disabled = true;

    try {
      // Handles changing usernames.
      if (username !== currentUsername) {
        const responseUsername = await axios.post(
          "https://choochoochampionsapi.azurewebsites.net/user/updateUsername",
          null,
          {
            params: {
              username: currentUsername,
              newUsername: username,
            },
          }
        );
        if (responseUsername.status === 200) {
          if (profileImage !== "https://upload.wikimedia.org/wikipedia/en/thumb/d/dc/Thomas_Tank_Engine_1.JPG/220px-Thomas_Tank_Engine_1.JPG") {
            const pathReference = ref(storage, currentUsername);
            await deleteObject(pathReference).then(() => {
              console.log("Profile Image Deleted Successfully!");
            })
          }
          alert("Username changed successfully!");
          sessionStorage.setItem("username", username);
        } else {
          console.error("Failed to update username:", responseUsername.data);
          alert("Failed to update username. Please try again.");
        }
      }

      // Handles changing emails.
      if (email !== currentEmail) {
        const responseEmail = await axios.post(
          "https://choochoochampionsapi.azurewebsites.net/user/updateEmail",
          null,
          {
            params: {
              username: username,
              newEmail: email,
            },
          }
        );
        if (responseEmail.status === 200) {
          alert("Email changed. Please verify it.");
          sessionStorage.setItem("email", email);
          window.location.href = `/email-verification?username=${encodeURIComponent(
            username
          )}&email=${encodeURIComponent(email)}`;
        } else {
          console.error("Failed to update email:", responseEmail.data);
          alert("Failed to update email. Please try again.");
        }
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  return (
    <div className="profile-page full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <div className="container">
          <div className="profile-section left">
            <label htmlFor="profile-image-input" className="profile-image-edit">
              <img src={profileImage} alt="Profile" className="profile-image" />
              <input
                type="file"
                accept="image/*"
                id="profile-image-input"
                onChange={handleImageChange}
              />
              <span className="edit-icon">
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </label>
            <div className="navigation-buttons">
              <Link to="/dashboard" className="button-link">
                Dashboard
              </Link>
              <Link to="/change-password" className="button-link">
                Change Password
              </Link>
              {/* toggle */}
              <div className="button-link-toggle">
                <div className="toggle-wrapper">
                  <label htmlFor="colorblind">Colorblind</label>
                  <label className="toggle-slider">
                    <input
                      type="checkbox"
                      id="colorblind"
                      checked={colorblind}
                      onChange={handleColorblindToggle}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {/* toggle */}
              <Link to="/" className="button-link">
                Log Out
              </Link>
            </div>
          </div>
          <div className="profile-section right">
            <form className="account-details" onSubmit={handleSubmit}>
              <div className="input-wrapper">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
