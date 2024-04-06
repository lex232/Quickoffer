const TruncateText = (text) => {
    return (
      text.length > 200 ? text.substring(0, 199) + "..." : text
    );
  };
  
  export default TruncateText;