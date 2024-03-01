import React, { useState, useEffect, useRef  } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getFormattedDate } from "../../utils/dateUtils";
import styles from "./BoardPage.module.css";
import ToDoCard from "./ToDoCard";
import { toast } from "react-toastify";

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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false); // State for managing toast visibility
  const [selectedFilter, setSelectedFilter] = useState("thisWeek");
  const [showFullTitle, setShowFullTitle] = useState(false);

   // Function to display a clipped version of the title
   const getClippedTitle = (title) => {
    const characterLimit = 25; // Adjust the character limit as needed
    if (showFullTitle) {
      return title;
    }
    return title.length > characterLimit ? `${title.slice(0, characterLimit)}...` : title;
  };
  // Function to check if the due date is passed
  const isDueDatePassed = (dueDate) => {
    const currentDate = new Date();
    const cardDueDate = new Date(dueDate);
    return cardDueDate < currentDate;
  };

  // Function to set the due date button color based on conditions
  const getDueDateButtonColor = (card) => {

    if (!card.dueDate) {
      return ''; // Return empty string if no due date is set
    }
  

    if (card.state === 'Done') {
      return 'green'; // Set to green if the task is done
    } else if (isDueDatePassed(card.dueDate)) {
      return 'red'; // Set to red if the due date is passed
    } else {
      return 'gray'; // Default color
    }
  };
  
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
    const sections = ['Backlog','Progress', 'Done', 'ToDo'];
  
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
      // Find the index of the card in the current state
      const cardIndex = cards.findIndex((card) => card._id === cardId);
  
      // Ensure the card is found
      if (cardIndex === -1) {
        throw new Error(`Card with ID ${cardId} not found.`);
      }
  
      // Remove the card from its current position
      const movedCard = cards.splice(cardIndex, 1)[0];
  
      // Update the card's section
      movedCard.state = targetSection;
  
      // Add the card to the top of the section
      const updatedCards = [movedCard, ...cards];
  
      // Update the local state
      setCards(updatedCards);
  
      // Make an API request to update the card's section on the server
      const response = await fetch(`/api/users/cards/${cardId}/move`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed (e.g., authentication headers)
        },
        body: JSON.stringify({ section: targetSection }),
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

  // Calculate the start and end dates based on the selected filter
let startDate, endDate;
if (selectedFilter === "today") {
  startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Set to 12:00 am
  endDate = new Date();
  endDate.setDate(endDate.getDate() + 1); // Next day
  endDate.setHours(0, 0, 0, 0); // Set to 12:00 am of the next day
} else if (selectedFilter === "thisWeek") {
  endDate = new Date();
  startDate = new Date();
  startDate.setDate(endDate.getDate() - 6); // 7 days ago
  startDate.setHours(0, 0, 0, 0); // Set to 12:00 am
} else if (selectedFilter === "thisMonth") {
  endDate = new Date();
  startDate = new Date();
  startDate.setDate(endDate.getDate() - 29); // 30 days ago
  startDate.setHours(0, 0, 0, 0); // Set to 12:00 am
}

// Now startDate and endDate represent the desired time range

      console.log("Selected Filter:", selectedFilter);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      const response = await fetch("/api/users/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });

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
  }, [selectedFilter]); // Update cards when the filter changes


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
  
  const openDeleteConfirmation = (cardId) => {
    setCardIdToDelete(cardId);
    setShowDeleteConfirmation(true);
  };
  
  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };


  const handleDeleteCard = async (cardId) => {
     // Open the delete confirmation modal
     openDeleteConfirmation(cardId);
    };
    
    const confirmDeleteAction = async () => {
      try {
        // Make an API request to delete the card
        const response = await fetch(`/api/users/cards/${cardIdToDelete}`, {
          method: "DELETE",
          // Add any other headers as needed (e.g., authentication headers)
        });

        // Check if the request was successful
        if (!response.ok) {
          throw new Error("Failed to delete the card");
        }

        // Remove the deleted card from the state
        setCards((prevCards) => prevCards.filter((card) => card._id !== cardIdToDelete));
      } catch (error) {
        // Handle errors
        console.error("Error deleting card:", error.message);
     
        } finally {
  // Close the delete confirmation modal
  closeDeleteConfirmation();
    }
  };

  const DeleteConfirmationModal = () => {
    return (
    <div className={styles.popup}>
    <div className={styles.content}>
    <p>Are you sure you want to Delete?</p>
    <div className={styles.popupButtons}>
    <button onClick={confirmDeleteAction} className={styles.deletePopupButton}>Yes</button>


    <button onClick={closeDeleteConfirmation} className={styles.deletePopupButton}>No</button>
    </div>
    </div>
    </div>
    );
    };

  const handleSaveEdit = async (editedCard) => {
    try {
      // Ensure editedCard has the necessary fields based on your cardSchema
    const updatedCardData = {
      title: editedCard.title,
      priority: editedCard.priority,
      checklist: editedCard.checklist,
      dueDate: editedCard.dueDate,
      state: 'ToDo', // Set the state explicitly to 'ToDo'

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

  const handleShareCard = (cardId) => {
    const sharedLink = `${window.location.origin}/api/users/shared-card/${cardId}`;
    console.log('Shared Link:', sharedLink);
     // Copy shared link to clipboard
     navigator.clipboard.writeText(sharedLink).then(() => {
      // Display toast message
      setShowToast(true);
    });
    // Display the shared link to the user
  };

    // Function to close the toast message after a certain duration
    const closeToast = () => {
      setShowToast(false);
    };
  
    useEffect(() => {
      // Close the toast message after 2 seconds
      const timeout = setTimeout(closeToast, 2000);
      return () => clearTimeout(timeout);
    }, [showToast]);
  
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuCardId(null);
      }
    };

    document.addEventListener('click', handleClickOutsideMenu);

    return () => {
      document.removeEventListener('click', handleClickOutsideMenu);
    };
  }, []);

  const handleMenuButtonClick = (cardId) => {
    setActiveMenuCardId(cardId);
  };
  // Define a function to close the menu popup
const closeMenuPopup = () => {
  setActiveMenuCardId(null);
};

//////////////////////////////////////////////////////////
const handleCollapseAll = () => {
  // Create a new array with updated showChecklist values
  const updatedCards = cards.map(card => ({
    ...card,
    showChecklist: false,
  }));

  // Update the state with the new array
  setCards(updatedCards);
};
  //////////////////////////////////////////////////////////////////////////////////
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
        <div className={styles.dateAndFilter}>
          <p className={styles.currentDate}>{getFormattedDate(currentDate)}</p>
          <div className={styles.filterDropdown}>
            {/* Your filter dropdown goes here */}
            <select
          onChange={(e) => setSelectedFilter(e.target.value)}
          value={selectedFilter}
        >
              <option value="today">Today</option>
              <option value="thisWeek" selected>
                This Week
              </option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>
        </div>
      </div>
    </div>

      {/* Board Sections */}
      <div className={styles.boardSections}>
       

      {/* Backlog Section */}
     
<div className={styles.boardSection}>
  <div className={styles.headingContainer}>
    <h2>Backlog</h2>
    <img src="/codicon_collapse-all.png"
     alt="Collapse All" 
     className={styles.collapseIcon}
     onClick={handleCollapseAll}
     />
  </div> 
  <div className={styles.scrollableTodoSection}>
    {cards
      .filter((card) => card.state === 'Backlog')
      .map((card) => (
        <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
          {/* Menu button inside the card */}
          <div className={styles.menuContainer} >
            <div className={styles.menuButton} onClick={() => handleMenuButtonClick(card._id)}>
              
            <span>&hellip;</span>
            </div>

            {/* Menu popup inside the card */}
            {activeMenuCardId === card._id && (
              <div className={styles.menuPopup}>
                <button onClick={() => { handleEditCard(card._id); closeMenuPopup(); }}>Edit</button>
                <button onClick={() => { handleShareCard(card._id); closeMenuPopup(); }}>Share</button>
                <button onClick={() => { handleDeleteCard(card._id); closeMenuPopup(); }}>Delete</button>
              </div>
            )}
          </div>
          {card.priority === 'High' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#FF2473" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}     
      {card.priority === 'Moderate' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#18B0FF" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}
      {card.priority === 'Low' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#63C05B" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}

<div className={styles.checklistContainer}>
  <div className={styles.textContainer}>
  <p className={styles.titleText} title={card.title}>
  {getClippedTitle(card.title)}
</p>
                      <p>
      Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})
    </p>
  </div>
  <div className={styles.buttonContainer}>
    <button onClick={() => handleToggleChecklist(card._id)}>
      {card.showChecklist ? '^' : '⌄'}
    </button>
  </div>
  {card.showChecklist && (
    <div className={styles.checklist}>
      <ul>
        {card.checklist.map((item, index) => (
          <li key={index} className={`${styles.checklistItem} ${styles.wrapText}`}>
            {item.checked ? <span className={styles.checked}><span className={styles.checkbox}></span></span> : <span className={styles.unchecked}></span>}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>



          {/* Add other card details as needed */}
          {/* You can customize the display of other card details based on your schema */}

          {/* Add buttons at the bottom of each card */}
          <div className={styles.cardButtons}>
     
<p className={`${styles.dueDate} ${!card.dueDate && styles.noDueDate}`}
 style={{ backgroundColor: getDueDateButtonColor(card) }}>
          {card.dueDate ? formatDate(card.dueDate) : ''}
        </p>
            {renderAdjacentSectionButtons(card, card.state)}
          </div>
        </div>
      ))}
  </div>
</div>

{/* To Do Section */}

<div className={styles.boardSection}>
<div className={styles.headingContainer}>
    <h2> To do</h2>
     <button className={styles.addButton} onClick={handleToDoCardOpen}>
            +
          </button>
    <img src="/codicon_collapse-all.png" alt="Collapse All" className={styles.collapseIcon}      onClick={handleCollapseAll}
 />
  </div>         
          {/* Display all cards in ToDo */}
          <div className={styles.scrollableTodoSection}>
             {cards
      .filter((card) => card.state === 'ToDo') // Filter cards only in the 'ToDo' state
      .reverse() // Reverse the order to show newest cards at the top

            .map((card) => (
              <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
                {/* Menu button inside the card */}
                <div className={styles.menuContainer}>
                  <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
                  <span >&hellip;</span>
                  </div>

                  {/* Menu popup inside the card */}
                  {activeMenuCardId === card._id && (
                                 <div className={styles.menuPopup}>
                                 <button onClick={() => { handleEditCard(card._id); closeMenuPopup(); }}>Edit</button>
                                 <button onClick={() => { handleShareCard(card._id); closeMenuPopup(); }}>Share</button>
                                 <button onClick={() => { handleDeleteCard(card._id); closeMenuPopup(); }}>Delete</button>
                               </div>
                  )}
                </div>

                {card.priority === 'High' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#FF2473" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}     
      {card.priority === 'Moderate' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#18B0FF" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}
      {card.priority === 'Low' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#63C05B" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}
    <div className={styles.checklistContainer}>
  <div className={styles.textContainer}>
  <p className={styles.titleText} title={card.title}>
  {getClippedTitle(card.title)}
</p>
                      <p>
      Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})
    </p>
  </div>
  <div className={styles.buttonContainer}>
    <button onClick={() => handleToggleChecklist(card._id)}>
      {card.showChecklist ? '^' : '⌄'}
    </button>
  </div>
  {card.showChecklist && (
    <div className={styles.checklist}>
      <ul>
        {card.checklist.map((item, index) => (
          <li key={index} className={`${styles.checklistItem} ${styles.wrapText}`}>
            {item.checked ? <span className={styles.checked}><span className={styles.checkbox}></span></span> : <span className={styles.unchecked}></span>}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>



                
                {/* Add other card details as needed */}
                {/* You can customize the display of other card details based on your schema */}

                {/* Add buttons at the bottom of each card */}
              <div className={styles.cardButtons}>
              <p className={`${styles.dueDate} ${!card.dueDate && styles.noDueDate}`} style={{ backgroundColor: getDueDateButtonColor(card) }}>
          {card.dueDate ? formatDate(card.dueDate) : ''}
        </p>
              {renderAdjacentSectionButtons(card, card.state)}

              </div>
            
              </div>
            ))}
          </div>

          
        </div>

{/* In Progress Section */}

<div className={styles.boardSection}>
  <div className={styles.headingContainer}>
    <h2> In Progress</h2>
    <img src="/codicon_collapse-all.png" alt="Collapse All" className={styles.collapseIcon}      onClick={handleCollapseAll}
/>
  </div> 
  <div className={styles.scrollableTodoSection}>
    {cards
      .filter((card) => card.state === 'Progress')
      .map((card) => (
        <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
          {/* Menu button inside the card */}
          <div className={styles.menuContainer}>
            <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
            <span>&hellip;</span>
            </div>

            {/* Menu popup inside the card */}
            {activeMenuCardId === card._id && (
                          <div className={styles.menuPopup}>
                          <button onClick={() => { handleEditCard(card._id); closeMenuPopup(); }}>Edit</button>
                          <button onClick={() => { handleShareCard(card._id); closeMenuPopup(); }}>Share</button>
                          <button onClick={() => { handleDeleteCard(card._id); closeMenuPopup(); }}>Delete</button>
                        </div>
            )}
          </div>

          {card.priority === 'High' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#FF2473" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}     
      {card.priority === 'Moderate' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#18B0FF" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}
      {card.priority === 'Low' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#63C05B" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}         
    <div className={styles.checklistContainer}>
  <div className={styles.textContainer}>
  <p className={styles.titleText} title={card.title}>
  {getClippedTitle(card.title)}
</p>
                      <p>
      Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})
    </p>
  </div>
  <div className={styles.buttonContainer}>
    <button onClick={() => handleToggleChecklist(card._id)}>
      {card.showChecklist ? '^' : '⌄'}
    </button>
  </div>
  {card.showChecklist && (
    <div className={styles.checklist}>
      <ul>
        {card.checklist.map((item, index) => (
          <li key={index} className={`${styles.checklistItem} ${styles.wrapText}`}>
            {item.checked ? <span className={styles.checked}><span className={styles.checkbox}></span></span> : <span className={styles.unchecked}></span>}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>



          {/* Add other card details as needed */}
          {/* You can customize the display of other card details based on your schema */}

          {/* Add buttons at the bottom of each card */}
          <div className={styles.cardButtons}>
          <p className={`${styles.dueDate} ${!card.dueDate && styles.noDueDate}`} style={{ backgroundColor: getDueDateButtonColor(card) }}>
          {card.dueDate ? formatDate(card.dueDate) : ''}
        </p>
            {renderAdjacentSectionButtons(card, card.state)}
          </div>
        </div>
      ))}
  </div>
</div>

{/* Done Section */}
<div className={styles.boardSection}>
  <div className={styles.headingContainer}>
    <h2>Done</h2>
    <img src="/codicon_collapse-all.png" alt="Collapse All" className={styles.collapseIcon}      onClick={handleCollapseAll}
/>
  </div> 
  <div className={styles.scrollableTodoSection}>
    {cards
      .filter((card) => card.state === 'Done')
      .map((card) => (
        <div key={card._id} className={`${styles.card} ${card.showChecklist ? '' : styles.collapsed}`}>
          {/* Menu button inside the card */}
          <div className={styles.menuContainer}>
            <div className={styles.menuButton} onClick={() => setActiveMenuCardId(card._id)}>
            <span>&hellip;</span>
            </div>

            {/* Menu popup inside the card */}
            {activeMenuCardId === card._id && (
                          <div className={styles.menuPopup}>
                          <button onClick={() => { handleEditCard(card._id); closeMenuPopup(); }}>Edit</button>
                          <button onClick={() => { handleShareCard(card._id); closeMenuPopup(); }}>Share</button>
                          <button onClick={() => { handleDeleteCard(card._id); closeMenuPopup(); }}>Delete</button>
                        </div>
            )}
          </div>

          {card.priority === 'High' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#FF2473" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}     
      {card.priority === 'Moderate' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#18B0FF" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}
      {card.priority === 'Low' && (
  <div className={styles.priorityContainer}>
    <div className={styles.circle} style={{ backgroundColor: "#63C05B" }}></div>
    <p className={styles.priorityText}>{card.priority} Priority</p>
  </div>
)}         
    <div className={styles.checklistContainer}>
  <div className={styles.textContainer}>
  <p className={styles.titleText} title={card.title}>
  {getClippedTitle(card.title)}
</p>
                      <p>
      Checklist ({card.checklist.filter((task) => task.checked).length}/{card.checklist.length})
    </p>
  </div>
  <div className={styles.buttonContainer}>
    <button onClick={() => handleToggleChecklist(card._id)}>
      {card.showChecklist ? '^' : '⌄'}
    </button>
  </div>
  {card.showChecklist && (
    <div className={styles.checklist}>
      <ul>
        {card.checklist.map((item, index) => (
          <li key={index} className={`${styles.checklistItem} ${styles.wrapText}`}>
            {item.checked ? <span className={styles.checked}><span className={styles.checkbox}></span></span> : <span className={styles.unchecked}></span>}
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

          {/* Add other card details as needed */}
          {/* You can customize the display of other card details based on your schema */}

          {/* Add buttons at the bottom of each card */}
          <div className={styles.cardButtons}>
          <p className={`${styles.dueDate} ${!card.dueDate && styles.noDueDate}`} style={{ backgroundColor: getDueDateButtonColor(card) }}>
          {card.dueDate ? formatDate(card.dueDate) : ''}
        </p>
            {renderAdjacentSectionButtons(card, card.state)}
          </div>
        </div>
      ))}
  </div>
</div>

        {modalVisible && <ToDoCard onClose={handleToDoCardClose} onSave={handleSaveCard} />}
        {editedCard && editedCard._id && (
          <ToDoCard
            onClose={handleToDoCardClose}
            onSave={handleSaveEdit}
            initialData={editedCard}
          />
        )}
      </div>

      {/* Additional content from your existing Dashboard.jsx goes here */}
      {/* You can merge any other specific content or components as needed */}
      
{showDeleteConfirmation && <DeleteConfirmationModal />}
   {/* Toast Message */}
   {showToast && (
        <div className={styles.toastMessage}>
          <p>Link Copied</p>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
