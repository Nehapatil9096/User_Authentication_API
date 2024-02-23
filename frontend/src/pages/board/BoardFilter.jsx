// components/BoardFilter.jsx

import React from "react";

const BoardFilter = ({ username }) => {
  return (
    <div className="board-filter">
      <span>Welcome! {username}</span>
      <span>Board</span>
      <span>{getCurrentDate()}</span>
      <select>
        <option value="today">Today</option>
        <option value="thisWeek">This Week</option>
        <option value="thisMonth">This Month</option>
      </select>
    </div>
  );
};

export default BoardFilter;

// Helper function to get the current date in the desired format
const getCurrentDate = () => {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString(undefined, options);
};
