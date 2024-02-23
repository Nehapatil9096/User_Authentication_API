import React from "react";
import styles from "./AnalyticsPage.module.css";

const AnalyticsPage = () => {
  const analyticsData = {
    backlogTasks: 16,
    toDoTasks: 14,
    inProgressTasks: 3,
    completedTasks: 22,
    lowPriorityTasks: 16,
    moderatePriorityTasks: 14,
    highPriorityTasks: 3,
    dueDateTasks: 3,
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.analyticsContainer1}>
  <div className={styles.analyticsSection}>
    <div className={styles.analyticsTitle}>Backlog Tasks</div>
    <div className={styles.analyticsValue}>{analyticsData.backlogTasks}</div>
  </div>
  <div className={styles.analyticsSection}>
    <div className={styles.analyticsTitle}>To-do Tasks</div>
    <div className={styles.analyticsValue}>{analyticsData.toDoTasks}</div>
  </div>
  <div className={styles.analyticsSection}>
    <div className={styles.analyticsTitle}>In-Progress Tasks</div>
    <div className={styles.analyticsValue}>{analyticsData.inProgressTasks}</div>
  </div>
  <div className={styles.analyticsSection}>
    <div className={styles.analyticsTitle}>Completed Tasks</div>
    <div className={styles.analyticsValue}>{analyticsData.completedTasks}</div>
  </div>
</div>
<div className={styles.analyticsContainer2}>

      <div className={styles.analyticsSection}>
        <div className={styles.analyticsTitle}>Low Priority</div>
        <div className={styles.analyticsValue}>{analyticsData.lowPriorityTasks}</div>
      </div>
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsTitle}>Moderate Priority</div>
        <div className={styles.analyticsValue}>{analyticsData.moderatePriorityTasks}</div>
      </div>
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsTitle}>High Priority</div>
        <div className={styles.analyticsValue}>{analyticsData.highPriorityTasks}</div>
      </div>
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsTitle}>Due Date Tasks</div>
        <div className={styles.analyticsValue}>{analyticsData.dueDateTasks}</div>
      </div>
    </div>
    </div>
  );
};

export default AnalyticsPage;