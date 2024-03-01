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
  const [selectedPriority, setSelectedPriority] = useState(defaultPriority);

  useEffect(() => {
    setSelectedPriority(defaultPriority);

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
    const newCard = {
      title,
      state: "ToDo",
      priority: selectedPriority,
      checklist,
      dueDate,
    };

    if (initialData && initialData._id) {
      newCard._id = initialData._id;
    }

    onSave(newCard);
    onClose();
  };

  const handlePriorityClick = (value) => {
    setSelectedPriority(value);
    document.body.style.backgroundColor = "#EEECEC";
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.toDoCard}>
        <div className={styles.cardHeader}>
          <label>Title </label>
          <input
            type="text"
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.cardContent}>
          <div className={styles.priorityOptions}>
            <label>Select Priority </label>
            <div className={styles.priority}>
  <button
    className={`${styles.priorityButton} ${
      selectedPriority === "High" ? styles.selectedPriority : ""
    } ${
      selectedPriority === "High" ? styles.selected : ""
    }`}
    onClick={() => handlePriorityClick("High")}
  >
    <div className={styles.circle} style={{ backgroundColor: "#FF2473" }}></div>{" "}
    {selectedPriority === "High" ? "HIGH PRIORITY" : "HIGH PRIORITY"}
  </button>
</div>
<div className={styles.priority}>
  <button
    className={`${styles.priorityButton} ${
      selectedPriority === "Moderate" ? styles.selectedPriority : ""
    } ${
      selectedPriority === "Moderate" ? styles.selected : ""
    }`}
    onClick={() => handlePriorityClick("Moderate")}
  >
    <div className={styles.circle} style={{ backgroundColor: "#18B0FF" }}></div>{" "}
    {selectedPriority === "Moderate" ? "MODERATE PRIORITY" : "MODERATE PRIORITY"}
  </button>
</div>
            <div className={styles.priority}>
  <button
    className={`${styles.priorityButton} ${
      selectedPriority === "Low" ? styles.selectedPriority : ""
    } ${
      selectedPriority === "Low" ? styles.selected : ""
    }`}
    onClick={() => handlePriorityClick("Low")}
  >
    <div className={styles.circle} style={{ backgroundColor: "#63C05B" }}></div>{" "}
    {selectedPriority === "Low" ? "LOW PRIORITY" : "LOW PRIORITY"}
  </button>
</div>

          </div>
          <div className={styles.checklist}>
            <label>Checklist ({checklist.filter((task) => task.checked).length}/{checklist.length})</label>
          </div>
          <div className={styles.checklistContainer}>
            <div className={styles.addNewTask}>
              {checklist.map((task, index) => (
                <div key={index} className={styles.task}>
                  <input
                    type="checkbox"
                    checked={task.checked}
                    onChange={() => toggleTaskCompletion(index)}
                  />
                  <input
                    type="text"
                    placeholder="Add a task"
                    value={task.text}
                    onChange={(e) => updateTaskText(index, e.target.value)}
                  />
                  <button onClick={() => deleteTask(index)}>
                  <FaTrash style={{ color: '#CF3636' }} /> {/* Apply red color inline */}
                  </button>
                </div>
              ))}
              <div className={styles.plusbutton}>
                <button onClick={addNewTask}>+ Add New</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <div className={styles.bottomButtons}>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholderText="Select Due Date"
              popperPlacement="right-start"
              className={styles.customDatePicker}
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
