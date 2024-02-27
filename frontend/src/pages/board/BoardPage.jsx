import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getFormattedDate } from "../../utils/dateUtils";
import styles from "./BoardPage.module.css";
import ToDoCard from "./ToDoCard";

const BoardPage = () => {
  const { authUser, setAuthUserData } = useAuthContext();
  const currentDate = new Date().toISOString();
  const [showToDoCard, setShowToDoCard] = useState(false);
  const [cards, setCards] = useState(authUser.cards || []); // Initialize with user's existing cards
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMenuCardId, setActiveMenuCardId] = useState(null); // Use a global state
  const [editedCard, setEditedCard] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleToDoCardOpen = () => {
    // Reset the edited card state when opening the ToDoCard
    setEditedCard(null);
    setModalVisible(true);
  };

  const handleToDoCardClose = () => {
    console.log('Closing modal');

    setModalVisible(false);
    setEditedCard(null); // Reset edited card
  };

  const renderAdjacentSectionButtons = (card, currentSection) => {
    const sections = ['Backlog', 'In Progress', 'Done', 'ToDo'];
  
    return sections
    .filter((targetSection) => targetSection !== currentSection)
    .map((targetSection) => (
      <button 
        key={targetSection} 
        onClick={() => moveCardToSection(card._id, targetSection)} 
        className={`${styles.cardButton} ${styles[targetSection.toLowerCase() + 'Button']}`}
      >
        {targetSection}
      </button>
      ));
  };
  
  
  const moveCardToSection = async (cardId, targetSection) => {
    try {
      // Update the card's section locally
      const updatedCards = cards.map((card) =>
        card._id === cardId ? { ...card, state: targetSection } : card
      );
      setCards(updatedCards);
  
      // Make an API request to update the card's section on the server
      const response = await fetch(`/api/users/cards/${cardId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed (e.g., authentication headers)
        },
        body: JSON.stringify({ section: targetSection }), // Change 'state' to 'section'
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Failed to move the card to ${targetSection}`);
      }
  
      // Optionally fetch updated cards from the server if needed
      // await fetchUserCards();
  
      // Handle success as needed
      console.log(`Card moved to ${targetSection}`);
    } catch (error) {
      // Handle errors
      console.error(`Error moving card to ${targetSection}:`, error.message);
    }
  };
  

  const fetchUserCards = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/users/cards");
      if (!response.ok) {
        throw new Error("Failed to fetch cards from the server");
      }

      const data = await response.json();
      console.log("Fetched cards from the server:", data.cards);

      // Ensure each card has a valid _id
      const updatedCards = data.cards.map((card) => ({
        ...card,
        _id: card._id,
      }));

      setCards([...updatedCards]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCard = async (newCard) => {
    try {
      // Update the state with the new card
      const updatedCards = [newCard];
      setCards(updatedCards);

      // Update the user data in context and localStorage
      const updatedUser = { ...authUser, cards: updatedCards };
      setAuthUserData(updatedUser);

      // Make an API request to update the user data on the server
      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed (e.g., authentication headers)
        },
        body: JSON.stringify(updatedUser),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to save the new card on the server");
      }

      // Fetch the updated cards from the server
      await fetchUserCards();

      // Handle success as needed
      console.log("User data updated on the server");
    } catch (error) {
      // Handle errors
      console.error("Error updating user data:", error.message);
    }
  };

  useEffect(() => {
    // Fetch cards when the component mounts or when a user logs in
    fetchUserCards();
  }, []);

  const handleToggleChecklist = (cardId) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card._id === cardId ? { ...card, showChecklist: !card.showChecklist } : card
      )
    );
  };
///////////////////////////edit ca
  const handleEditCard = (cardId) => {
    // Find the card with the given ID
    const selectedCard = cards.find((card) => card._id === cardId);
    console.log("Selected Card:", selectedCard);

    // Open the ToDoCard modal with pre-filled data
    setEditedCard(selectedCard);
    setEditModalVisible(true);
  };

  const handleDeleteCard = async (cardId) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this card?");

    if (confirmDelete) {
      try {
        // Make an API request to delete the card
        const response = await fetch(`/api/users/cards/${cardId}`, {
          method: "DELETE",
          // Add any other headers as needed (e.g., authentication headers)
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to delete the card");
        }

        // Remove the deleted card from the state
        setCards((prevCards) => prevCards.filter((card) => card._id !== cardId));
      } catch (error) {
        // Handle errors
        console.error("Error deleting card:", error.message);
      }
    }
  };
  const handleSaveEdit = async (editedCard) => {
    try {
      // Ensure editedCard has the necessary fields based on your cardSchema
    const updatedCardData = {
      title: editedCard.title,
      priority: editedCard.priority,
      checklist: editedCard.checklist,
      dueDate: editedCard.dueDate,
      // Add other fields as needed
    };
       
      // Make an API request to update the existing card on the server
      const response = await fetch(`/api/users/onecard/${editedCard._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any other headers as needed (e.g., authentication headers)
        },
        body: JSON.stringify({ updatedCardData }), // Send the updated card data
      });
  
      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to save the edits on the server");
      }
  
      // Fetch the updated cards from the server
      await fetchUserCards();
  
      // Handle success as needed
      console.log("Card edits saved on the server");
  
      // Close the ToDoCard modal immediately after saving
      setEditModalVisible(false);
    } catch (error) {
      // Handle errors
      console.error("Error saving card edits:", error.message);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.boardPage}>
      {/* Top Left Text */}
      <div className={`${styles.top} ${styles.whiteBackground}`}>

      <div className={`${styles.topLeftText} ${styles.whiteBackground}`}>
        <h1 className={styles.welcome}>Welcome, {authUser.username}!</h1>
        <p className={styles.boardText}>Board</p>
      </div>

      {/* Top Right Section */}
      <div className={`${styles.topRight} ${styles.whiteBackground}`}>
        
        <div className={styles.filterDropdown}>
          {/* Your filter dropdown goes here */}
          <select>
            <option value="today">Today</option>
            <option value="thisWeek" selected>
              This Week
            </option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
        <div>
      <p className={styles.currentDate}>{getFormattedDate(currentDate)}</p>
    </div>
      </div>
</div>

      {/* Board Sections */}
      <div className={styles.boardSections}>
       

      {/* Backlog Section */}
     
<div className={styles.boardSection}>
  <h2>Backlog</h2>
  <div className={styles.scrollableTodoSection}>
    {cards
      .filter((card) => card.state === 'Backlog')
      .map((card) => (
        <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
          {/* Menu button inside the card */}
          <div className={styles.menuContainer}>
            <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
              <span>&#8942;</span>
            </div>

            {/* Menu popup inside the card */}
            {activeMenuCardId === card._id && (
              <div className={styles.menuPopup}>
                <button onClick={() => handleEditCard(card._id)}>Edit</button>
                {/* Add other menu options as needed */}
                <button onClick={() => handleShareCard(card._id)}>Share</button>
                <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
              </div>
            )}
          </div>

          <p>Priority: {card.priority}</p>
          <h2>{card.title}</h2>
          <p>Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})</p>
          {/* Display checklist items */}
          <div className={styles.checklist}>
            <button onClick={() => handleToggleChecklist(card._id)}>
              {card.showChecklist ? 'Collapse' : 'Expand'}
            </button>
            {card.showChecklist && (
              <>
                <ul>
                  {card.checklist.map((item, index) => (
                    <li key={index}>
                      {item.checked ? <span>[x]</span> : <span>[ ]</span>} {item.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <p className={styles.dueDate}>{card.dueDate ? formatDate(card.dueDate) : 'Not specified'}</p>

          {/* Add other card details as needed */}
          {/* You can customize the display of other card details based on your schema */}

          {/* Add buttons at the bottom of each card */}
          <div className={styles.cardButtons}>
            {renderAdjacentSectionButtons(card, card.state)}
          </div>
        </div>
      ))}
  </div>
</div>

{/* To Do Section */}
<div className={styles.boardSection}>
          To do
          <button className={styles.addButton} onClick={handleToDoCardOpen}>
            +
          </button>
          {/* Display all cards in ToDo */}
          <div className={styles.scrollableTodoSection}>
             {cards
      .filter((card) => card.state === 'ToDo') // Filter cards only in the 'ToDo' state
   
            .map((card) => (
              <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
                {/* Menu button inside the card */}
                <div className={styles.menuContainer}>
                  <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
                    <span>&#8942;</span>
                  </div>

                  {/* Menu popup inside the card */}
                  {activeMenuCardId === card._id && (
                    <div className={styles.menuPopup}>
                      <button onClick={() => handleEditCard(card._id)}>Edit</button>
                      {/* Add other menu options as needed */}
                      <button onClick={() => handleShareCard(card._id)}>Share</button>
                      <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
                    </div>
                  )}
                </div>

                <p>Priority: {card.priority}</p>
                <h2>{card.title}</h2>
                <p>Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})</p>
                {/* Display checklist items */}
                <div className={styles.checklist}>
                  <button onClick={() => handleToggleChecklist(card._id)}>
                    {card.showChecklist ? 'Collapse' : 'Expand'}
                  </button>
                  {card.showChecklist && (
                    <>
                      <ul>
                        {card.checklist.map((item, index) => (
                          <li key={index}>
                            {item.checked ? <span>[x]</span> : <span>[ ]</span>} {item.text}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <p className={styles.dueDate}>{card.dueDate ? formatDate(card.dueDate) : 'Not specified'}</p>
                
                {/* Add other card details as needed */}
                {/* You can customize the display of other card details based on your schema */}

                {/* Add buttons at the bottom of each card */}
              <div className={styles.cardButtons}>
              {renderAdjacentSectionButtons(card, card.state)}

              </div>
            
              </div>
            ))}
          </div>
        </div>

{/* In Progress Section */}

<div className={styles.boardSection}>
  <h2>In Progress</h2>
  <div className={styles.scrollableTodoSection}>
    {cards
      .filter((card) => card.state === 'In Progress')
      .map((card) => (
        <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
          {/* Menu button inside the card */}
          <div className={styles.menuContainer}>
            <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
              <span>&#8942;</span>
            </div>

            {/* Menu popup inside the card */}
            {activeMenuCardId === card._id && (
              <div className={styles.menuPopup}>
                <button onClick={() => handleEditCard(card._id)}>Edit</button>
                {/* Add other menu options as needed */}
                <button onClick={() => handleShareCard(card._id)}>Share</button>
                <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
              </div>
            )}
          </div>

          <p>Priority: {card.priority}</p>
          <h2>{card.title}</h2>
          <p>Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})</p>
          {/* Display checklist items */}
          <div className={styles.checklist}>
            <button onClick={() => handleToggleChecklist(card._id)}>
              {card.showChecklist ? 'Collapse' : 'Expand'}
            </button>
            {card.showChecklist && (
              <>
                <ul>
                  {card.checklist.map((item, index) => (
                    <li key={index}>
                      {item.checked ? <span>[x]</span> : <span>[ ]</span>} {item.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <p className={styles.dueDate}>{card.dueDate ? formatDate(card.dueDate) : 'Not specified'}</p>

          {/* Add other card details as needed */}
          {/* You can customize the display of other card details based on your schema */}

          {/* Add buttons at the bottom of each card */}
          <div className={styles.cardButtons}>
            {renderAdjacentSectionButtons(card, card.state)}
          </div>
        </div>
      ))}
  </div>
</div>

{/* Done Section */}
<div className={styles.boardSection}>
  <h2>Done</h2>
  <div className={styles.scrollableTodoSection}>
    {cards
      .filter((card) => card.state === 'Done')
      .map((card) => (
        <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
          {/* Menu button inside the card */}
          <div className={styles.menuContainer}>
            <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
              <span>&#8942;</span>
            </div>

            {/* Menu popup inside the card */}
            {activeMenuCardId === card._id && (
              <div className={styles.menuPopup}>
                <button onClick={() => handleEditCard(card._id)}>Edit</button>
                {/* Add other menu options as needed */}
                <button onClick={() => handleShareCard(card._id)}>Share</button>
                <button onClick={() => handleDeleteCard(card._id)}>Delete</button>
              </div>
            )}
          </div>

          <p>Priority: {card.priority}</p>
          <h2>{card.title}</h2>
          <p>Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})</p>
          {/* Display checklist items */}
          <div className={styles.checklist}>
            <button onClick={() => handleToggleChecklist(card._id)}>
              {card.showChecklist ? 'Collapse' : 'Expand'}
            </button>
            {card.showChecklist && (
              <>
                <ul>
                  {card.checklist.map((item, index) => (
                    <li key={index}>
                      {item.checked ? <span>[x]</span> : <span>[ ]</span>} {item.text}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <p className={styles.dueDate}>{card.dueDate ? formatDate(card.dueDate) : 'Not specified'}</p>

          {/* Add other card details as needed */}
          {/* You can customize the display of other card details based on your schema */}

          {/* Add buttons at the bottom of each card */}
          <div className={styles.cardButtons}>
            {renderAdjacentSectionButtons(card, card.state)}
          </div>
        </div>
      ))}
  </div>
</div>

        {modalVisible && <ToDoCard onClose={handleToDoCardClose} onSave={handleSaveCard} />}
        {editedCard && editedCard._id && (
          <ToDoCard
            onClose={() => setEditModalVisible(false)}
            onSave={handleSaveEdit}
            initialData={editedCard}
          />
        )}
      </div>

      {/* Additional content from your existing Dashboard.jsx goes here */}
      {/* You can merge any other specific content or components as needed */}
    </div>
  );
};

export default BoardPage;
