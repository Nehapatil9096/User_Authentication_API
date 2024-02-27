// ToDoCard.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTrash } from "react-icons/fa";
import styles from "./ToDoCard.module.css";
const ToDoCard = ({ onClose, onSave, initialData, defaultPriority }) => {
const [title, setTitle] = useState("");
const [priority, setPriority] = useState("High");
const [checklist, setChecklist] = useState([]);
const [dueDate, setDueDate] = useState(null);
const [selectedPriority, setSelectedPriority] = useState(defaultPriority); // Initialize selectedPriority with defaultPriority

useEffect(() => {
  setSelectedPriority(defaultPriority); // Update selectedPriority if defaultPriority changes

// Set initial data when initialData prop changes
if (initialData) {
setTitle(initialData.title || "");
setPriority(initialData.priority || "High");
setChecklist(initialData.checklist || []);
setDueDate(initialData.dueDate || null);

}
}, [initialData]);
const addNewTask = () => {
setChecklist([...checklist, { text: "", checked: false }]);
};
const updateTaskText = (index, newText) => {
const updatedChecklist = [...checklist];
updatedChecklist[index].text = newText;
setChecklist(updatedChecklist);
};
const toggleTaskCompletion = (index) => {
const updatedChecklist = [...checklist];
updatedChecklist[index].checked = !updatedChecklist[index].checked;
setChecklist(updatedChecklist);
};
const deleteTask = (index) => {
const updatedChecklist = [...checklist];
updatedChecklist.splice(index, 1);
setChecklist(updatedChecklist);
};
const handleSave = () => {
// Form the card data
const newCard = {
title,

state: "ToDo", // Set the state to "ToDo" as the default state
priority: selectedPriority, // Use selected priority when saving

checklist,
dueDate,
};
if (initialData && initialData._id) {
// If _id exists in initialData, add it to the newCard
newCard._id = initialData._id;
}
// Call the onSave function from the parent component (BoardPage)
onSave(newCard);
// Close the ToDoCard component
onClose();
};
const handlePriorityClick = (value) => {
setSelectedPriority(value);
};
return (
<div className={styles.backdrop}>
<div className={styles.toDoCard}>
<div className={styles.cardHeader}>
{/* Line 1: Title text with an asterisk (*) indicating it's compulsory */}
<label>Title </label>
<input
type="text"
placeholder="Enter Task Title"
value={title}
onChange={(e) => setTitle(e.target.value)}
/>
</div>
<div className={styles.cardContent}>
{/* Line 2: Select Priority with options (High, Moderate, Low) */}
<div className={styles.priorityOptions}>
<label>Select Priority </label>
<div className={styles.priority}>
<button
className={`${styles.priorityButton} ${
selectedPriority === "High" ? styles.selectedPriority : ""
}`}
onClick={() => handlePriorityClick("High")}
>
<div className={styles.circle} style={{ backgroundColor: "pink" }}></div>{" "}
High Priority
</button>
</div>
<div className={styles.priority}>
<button
className={`${styles.priorityButton} ${
selectedPriority === "Moderate" ? styles.selectedPriority : ""
}`}
onClick={() => handlePriorityClick("Moderate")}
>
<div className={styles.circle} style={{ backgroundColor: "blue" }}></div>{" "}
Moderate Priority
</button>
</div>
<div className={styles.priority}>
<button
className={`${styles.priorityButton} ${
selectedPriority === "Low" ? styles.selectedPriority : ""
}`}
onClick={() => handlePriorityClick("Low")}
>
<div className={styles.circle} style={{ backgroundColor: "green" }}></div>{" "}
Low Priority
</button>
</div>
</div>
{/* Line 3: Checklist */}
<div className={styles.checklist}>
<label>Checklist ({checklist.filter((task) => task.checked).length}/{checklist.length})</label>
</div>
{/* Line 4: Add New Task */}
<div className={styles.addNewTask}>
{/* Render tasks */}
{checklist.map((task, index) => (
<div key={index} className={styles.task}>
<input
type="checkbox"
checked={task.checked}
onChange={() => toggleTaskCompletion(index)}
/>
<input
type="text"
value={task.text}
onChange={(e) => updateTaskText(index, e.target.value)}
/>
<button onClick={() => deleteTask(index)}>
<FaTrash />
</button>
</div>
))}
<div className={styles.plusbutton}>
<button onClick={addNewTask}>+ Add New Task</button>
</div>
</div>
</div>
<div className={styles.cardFooter}>
{/* Bottom: Select Due Date, Cancel, Save buttons */}
<div className={styles.bottomButtons}>
<DatePicker
selected={dueDate}
onChange={(date) => setDueDate(date)}
placeholderText="Select Due Date"
/>
<div className={styles.actionButtons}>
<button onClick={onClose}>Cancel</button>
<button onClick={handleSave}>Save</button>
</div>
</div>
</div>
</div>
</div>
);
};
export default ToDoCard;