
const formatDate = (dateFormat, date = new Date()) => {
  let inputDate = new Date(date);
  if (dateFormat === "mm/yy") {
    // format mm/yy
    return inputDate.toLocaleDateString(undefined, {
      month: "2-digit",
      year: "2-digit",
    });
  } else if (dateFormat === "long-noDay") {
    return inputDate.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  } else {
    return inputDate.toLocaleDateString();
  }
};



export default formatDate;