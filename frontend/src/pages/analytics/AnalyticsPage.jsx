import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

const AnalyticsPage = () => {
  const { authUser, setAuthUserData } = useAuthContext();
  const [cards, setCards] = useState(authUser.cards || []); // Initialize with user's existing cards

  // State to store analytics details
  const [analyticsDetails, setAnalyticsDetails] = useState({
    backlogTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    highPriorityTasks: 0,
    moderatePriorityTasks: 0,
    lowPriorityTasks: 0,
    checkedTasks: 0,
    dueDateTasks: 0,
  });

 // Fetch user cards
 const fetchUserCards = async () => {
  try {
    // Make an API request to fetch user cards
    const response = await fetch("/api/users/cards");
    if (!response.ok) {
      throw new Error("Failed to fetch cards from the server");
    }

    // Parse the response data
    const data = await response.json();

    // Update state with the fetched cards
    setCards(data.cards || []);
  } catch (error) {
    console.error("Error fetching user cards:", error.message);
  }
};

  // Calculate analytics details on component mount or when cards change
  useEffect(() => {
    console.log("existing cards", cards); // Log the cards data

    // Fetch user cards
    fetchUserCards();

    // Calculate analytics details
    const updatedAnalyticsDetails = calculateAnalyticsDetails(cards);

    // Update state with calculated details
    setAnalyticsDetails(updatedAnalyticsDetails);
  }, [cards]);

  // Function to calculate analytics details
  const calculateAnalyticsDetails = (cards) => {
    if (!cards || cards.length === 0) {
      // Handle the case when cards is undefined or empty
      return {
        backlogTasks: 0,
        todoTasks: 0,
        inProgressTasks: 0,
        highPriorityTasks: 0,
        moderatePriorityTasks: 0,
        lowPriorityTasks: 0,
        checkedTasks: 0,
        dueDateTasks: 0,
      };
    }

    // Initialize analytics details
    let updatedAnalyticsDetails = {
      backlogTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      highPriorityTasks: 0,
      moderatePriorityTasks: 0,
      lowPriorityTasks: 0,
      checkedTasks: 0,
      dueDateTasks: 0,
    };

    // Iterate through cards to calculate details
    cards.forEach((card) => {
      // Task state counts
      switch (card.state) {
        case "Backlog":
          updatedAnalyticsDetails.backlogTasks++;
          break;
        case "ToDo":
          updatedAnalyticsDetails.todoTasks++;
          break;
        case "In Progress":
          updatedAnalyticsDetails.inProgressTasks++;
          break;
        // Add other states as needed
        default:
          break;
      }

      // Priority counts
      switch (card.priority) {
        case "High":
          updatedAnalyticsDetails.highPriorityTasks++;
          break;
        case "Moderate":
          updatedAnalyticsDetails.moderatePriorityTasks++;
          break;
        case "Low":
          updatedAnalyticsDetails.lowPriorityTasks++;
          break;
        // Add other priority levels as needed
        default:
          break;
      }

      // Checked tasks count
      const checkedTasks = card.checklist.filter((task) => task.checked).length;
      updatedAnalyticsDetails.checkedTasks += checkedTasks;

      // Due date tasks count
      const dueDate = new Date(card.dueDate);
      const currentDate = new Date();
      if (card.dueDate && card.state !== "Done" && currentDate <= dueDate) {
        updatedAnalyticsDetails.dueDateTasks++;
      }
    });

    return updatedAnalyticsDetails;
  };

  return (
    <div>
      <h2>Analytics Page</h2>
      <p>Total Backlog Tasks: {analyticsDetails.backlogTasks}</p>
      <p>Total ToDo Tasks: {analyticsDetails.todoTasks}</p>
      <p>Total In Progress Tasks: {analyticsDetails.inProgressTasks}</p>
      <p>Total High Priority Tasks: {analyticsDetails.highPriorityTasks}</p>
      <p>Total Moderate Priority Tasks: {analyticsDetails.moderatePriorityTasks}</p>
      <p>Total Low Priority Tasks: {analyticsDetails.lowPriorityTasks}</p>
      <p>Total Checked Tasks: {analyticsDetails.checkedTasks}</p>
      <p>Total Due Date Tasks: {analyticsDetails.dueDateTasks}</p>
    </div>
  );
};

export default AnalyticsPage;
