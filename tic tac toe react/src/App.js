import React,{useState} from "react";
import "./App.css";

const Square = ({value,onClick}) => {
  return (
    <button className="square" onClick={onClick} style={{color: value === "X" ? "dodgerblue" : "#dd0f76"}}>{value}</button>
  );
};

const Board = () => {
  const [squares,setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if(squares[index] || calculateWinner(squares)) return;
    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
  };
  const winner = calculateWinner(squares);
  const isBoardFull = squares.every(square=>square !==null);
  const status = winner ? `Winner: ${winner}` : isBoardFull ? "It's a draw!" : `Next player: ${isXNext ? 'X' : 'O'}`;

  return(
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="reset-button" onClick={handleReset}>Reset Game</button>
    </div>
  );
  function renderSquare(i) {
    return <Square value={squares[i]} onClick={()=> handleClick(i)} />
  }
};

const calculateWinner = (squares) => {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i=0; i<lines.length;i++) {
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
      return squares[a];
    }
  }
  return null;
};


const App = () => {
  return (
    <div className="game">
      <div className="game-board">
        <Board/>
      </div>
    </div>
  );
};

export default App;




























