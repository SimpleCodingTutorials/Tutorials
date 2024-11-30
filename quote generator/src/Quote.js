import React, {useState} from "react";
import quotes from "./quotes.json";

const Quote = () => {
  const [quote,setQuote] = useState(quotes[0]);
  const [copied,setCopied] = useState(false);

  const fetchQuote = () => {
    const randomIndex = Math.floor(Math.random()*quotes.length);
    setQuote(quotes[randomIndex]);
  };

  const tweetQuote = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text="${quote.Quote}"-${quote.Author}`;
    window.open(twitterUrl,"_blank");
  };

  const copyToClipboard = ()=> {
    const textToCopy = `"${quote.Quote}"-${quote.Author}`;
    navigator.clipboard.writeText(textToCopy)
    .then(()=>{
      setCopied(true);
      setTimeout(()=>setCopied(false),2000);
    })
    .catch((error)=>console.error("Error copying text: ",error));
  };


  return (
    <div className="quote-box">
      <h1>Quote of the Day</h1>
      <p className="quote-text">“{quote.Quote}”</p>
      <p className="quote-author">- {quote.Author}</p>
      <hr />
  
      <div className="control-container">
        <div className="icon-container">
          <div className="share-button x-icon" onClick={tweetQuote}>
            <img src="x.png" alt="x" />
          </div>
          
          <div className="share-button" onClick={copyToClipboard}>
            <img src="copy.png" alt="copy" />
          </div>
          
          {copied && <span className="copied-message">Copied!</span>}
        </div>
  
        <button onClick={fetchQuote} className="new-quote-button">New Quote</button>
      </div>
    </div>
  );
  
}

export default Quote;




















// const Quote = () => {
//     // Initialize state with the first quote in the array or an empty object
//     const [quote, setQuote] = useState(quotes[0]);
//     const [copied, setCopied] = useState(false); // State to show "Copied!" message

//     const fetchQuote = () => {
//       const randomIndex = Math.floor(Math.random() * quotes.length);
//       setQuote(quotes[randomIndex]);
//     };
  
//     const tweetQuote = () => {
//       const twitterUrl = `https://twitter.com/intent/tweet?text="${quote.Quote}" - ${quote.Author}`;
//       window.open(twitterUrl, '_blank'); // Opens the Twitter share in a new tab
//     };

//     const copyToClipboard = () => {
//       const textToCopy = `"${quote.Quote}" - ${quote.Author}`;
//       navigator.clipboard.writeText(textToCopy)
//         .then(() => {
//           setCopied(true); // Show "Copied!" message
//           setTimeout(() => setCopied(false), 2000); // Hide message after 2 seconds
//         })
//         .catch((error) => console.error("Error copying text: ", error));
//     };
    
//     return (
//       <div className="quote-box">
//         <h1>Quote of the Day</h1>
//         <p className="quote-text"> “{quote.Quote}”</p>
//         <p className="quote-author"> - {quote.Author}</p>
//         <hr></hr>
//         <div className = "control-container" >
          
//         <div class= "icon-container">
//         <div className="share-button x-icon" onClick={tweetQuote} >
//           <img src="x.png"alt="x" />
//         </div>

//         <div className="share-button" >
//            <img src="copy.png" onClick={copyToClipboard}  alt="copy" />
//         </div>
//         {copied && <span className="copied-message">Copied!</span>}

//        </div>
//         <button onClick={fetchQuote} className="new-quote-button">New Quote</button>
//         </div>

//       </div>
//     );
//   };
  
  
  
