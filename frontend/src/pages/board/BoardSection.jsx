// pages/board/BoardSection.jsx

import React from "react";

const BoardSection = ({ title, tasks }) => {
  // Your BoardSection component logic here
  return (
    <div className="board-section">
      <h2>{title}</h2>
      {/* Render tasks or any other content for this section */}
      {tasks.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  );
};

export default BoardSection;
