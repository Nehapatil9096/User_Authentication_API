// utils/dateUtils.js

const getFormattedDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) {
      // Return a default message or handle the invalid date case
      return "Invalid Date";
    }
  
    const options = { day: "numeric", month: "short", year: "numeric" };
    const dateObject = new Date(dateString);
    const dayWithSuffix = addDaySuffix(dateObject.getDate());
    const formattedDate = dateObject.toLocaleDateString(undefined, options)
                          .replace(dateObject.getDate(), dayWithSuffix);
  
    return formattedDate;
  };
  
  // Function to add suffix to day
  const addDaySuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };
  
  export { getFormattedDate };
  