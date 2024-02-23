import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getFormattedDate } from "../../utils/dateUtils";
import styles from "./BoardPage.module.css";
import ToDoCard from "./ToDoCard";

const BoardPage = () => {
  const { authUser, setAuthUserData } = useAuthContext();
  const currentDate = new Date().toISOString();
  const [showToDoCard, setShowToDoCard] = useState(false);
  const [cards, setCards] = useState(authUser.cards || []);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setCards(userData.cards || []);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run the effect only once

  const handleToDoCardOpen = () => {
    setShowToDoCard(true);
  };

  const handleToDoCardClose = () => {
    setShowToDoCard(false);
  };

  const handleSaveCard = async (newCard) => {
    // Update the state with the new card
    setCards((prevCards) => [...prevCards, newCard]);
  
    // Update the user data in context and localStorage
    const updatedUser = { ...authUser, cards: [...cards, newCard] };
    setAuthUserData(updatedUser);
  
    try {
      // Make an API request to update the user data on the server
      const response = await fetch("/api/users/update/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to update user data on the server");
      }
  
      // Handle success as needed
      console.log("User data updated on the server");
    } catch (error) {
      // Handle errors
      console.error("Error updating user data:", error.message);
    }
  };

  return (
    <div className={styles.boardPage}>
      {/* Top Left Text */}
      <div className={styles.topLeftText}>
        <h1 className={styles.welcome}>Welcome, {authUser.username}!</h1>
        <p className={styles.boardText}>Board</p>
      </div>

      {/* Top Right Section */}
      <div className={styles.topRight}>
        <div>
          <p className={styles.currentDate}>{getFormattedDate(currentDate)}</p>
        </div>
        <div className={styles.filterDropdown}>
          {/* Your filter dropdown goes here */}
          <select>
            <option value="today">Today</option>
            <option value="thisWeek" selected>This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
      </div>

      {/* Board Sections */}
      <div className={styles.boardSections}>
        {cards.map((card) => (
          <div key={card._id} className={styles.boardSection}>
            {card.title}
            {/* Render other card details as needed */}
          </div>
        ))}

        <div className={styles.boardSection}>Backlog</div>
        <div className={styles.boardSection}>To do
          <button className={styles.addButton} onClick={handleToDoCardOpen}>
            +
          </button>
          {/* Display ToDo cards */}
          {cards
            .filter((card) => card.state === "ToDo")
            .map((card, index) => (
              <div key={index} className={styles.card}>
                <p>{card.title}</p>
                {/* Add other card details as needed */}
              </div>
            ))}

        </div>
        <div className={styles.boardSection}>In Progress</div>
        <div className={styles.boardSection}>Done</div>
        {showToDoCard && <ToDoCard onClose={handleToDoCardClose} />}

      </div>
      {showToDoCard && <ToDoCard onClose={handleToDoCardClose} onSave={handleSaveCard} />}

      {/* Additional content from your existing Dashboard.jsx goes here */}
      {/* You can merge any other specific content or components as needed */}
    </div>

  );
};

export default BoardPage;
