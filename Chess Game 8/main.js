let boardSquaresArray = [];
let positionArray = [];
let moves = [];
const castlingSquares = ["g1", "g8", "c1", "c8"];
let isWhiteTurn = true;
let enPassantSquare = "blank";
let allowMovement = true;
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");
const chessBoard = document.querySelector(".chessBoard");
const topLines = document.getElementById("topLines");

setupBoardSquares();
setupPieces();
fillBoardSquaresArray();
let startingPosition = generateFEN(boardSquaresArray);
getEvaluation(startingPosition,function(lines,evaluations,scoreString){
  displayEvaluation(lines,evaluations,scoreString,true,1);
})

function fillBoardSquaresArray() {
  const boardSquares = document.getElementsByClassName("square");
  for (let i = 0; i < boardSquares.length; i++) {
    let row = 8 - Math.floor(i / 8);
    let column = String.fromCharCode(97 + (i % 8));
    let square = boardSquares[i];
    square.id = column + row;
    let color = "";
    let pieceType = "";
    let pieceId = "";
    if (square.querySelector(".piece")) {
      color = square.querySelector(".piece").getAttribute("color");
      pieceType = square.querySelector(".piece").classList[1];
      pieceId = square.querySelector(".piece").id;
    } else {
      color = "blank";
      pieceType = "blank";
      pieceId = "blank";
    }
    let arrayElement = {
      squareId: square.id,
      pieceColor: color,
      pieceType: pieceType,
      pieceId: pieceId,
    };
    boardSquaresArray.push(arrayElement);
  }
}
function updateBoardSquaresArray(
  currentSquareId,
  destinationSquareId,
  boardSquaresArray,
  promotionOption = "blank"
) {
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === currentSquareId
  );
  let destinationSquareElement = boardSquaresArray.find(
    (element) => element.squareId === destinationSquareId
  );
  let pieceColor = currentSquare.pieceColor;
  let pieceType =
    promotionOption == "blank" ? currentSquare.pieceType : promotionOption;
  let pieceId =
    promotionOption == "blank"
      ? currentSquare.pieceId
      : promotionOption + currentSquare.pieceId;
  destinationSquareElement.pieceColor = pieceColor;
  destinationSquareElement.pieceType = pieceType;
  destinationSquareElement.pieceId = pieceId;
  currentSquare.pieceColor = "blank";
  currentSquare.pieceType = "blank";
  currentSquare.pieceId = "blank";
}

function makeMove(
  startingSquareId,
  destinationSquareId,
  pieceType,
  pieceColor,
  captured,
  promotedTo = "blank"
) {
  moves.push({
    from: startingSquareId,
    to: destinationSquareId,
    pieceType: pieceType,
    pieceColor: pieceColor,
    captured: captured,
    promotedTo: promotedTo,
  });
}

function generateFEN(boardSquares) {
  let fen = "";
  let rank = 8;
  while (rank >= 1) {
    for (
      let file = "a";
      file <= "h";
      file = String.fromCharCode(file.charCodeAt(0) + 1)
    ) {
      const square = boardSquares.find(
        (element) => element.squareId === `${file}${rank}`
      );
      if (square && square.pieceType) {
        let pieceNotation = "";
        switch (square.pieceType) {
          case "pawn":
            pieceNotation = "p";
            break;
          case "bishop":
            pieceNotation = "b";
            break;
          case "knight":
            pieceNotation = "n";
            break;
          case "rook":
            pieceNotation = "r";
            break;
          case "queen":
            pieceNotation = "q";
            break;
          case "king":
            pieceNotation = "k";
            break;
          case "blank":
            pieceNotation = "blank";
            break;
        }
        fen +=
          square.pieceColor === "white"
            ? pieceNotation.toUpperCase()
            : pieceNotation;
      }
    }
    if (rank > 1) {
      fen += "/";
    }
    rank--;
  }
  fen = fen.replace(
    new RegExp("blankblankblankblankblankblankblankblank", "g"),
    "8"
  );
  fen = fen.replace(
    new RegExp("blankblankblankblankblankblankblank", "g"),
    "7"
  );
  fen = fen.replace(new RegExp("blankblankblankblankblankblank", "g"), "6");
  fen = fen.replace(new RegExp("blankblankblankblankblank", "g"), "5");
  fen = fen.replace(new RegExp("blankblankblankblank", "g"), "4");
  fen = fen.replace(new RegExp("blankblankblank", "g"), "3");
  fen = fen.replace(new RegExp("blankblank", "g"), "2");
  fen = fen.replace(new RegExp("blank", "g"), "1");

  fen += isWhiteTurn ? " w " : " b ";

  let castlingString = "";

  let shortCastlePossibleForWhite =
    !kingHasMoved("white") && !rookHasMoved("white", "h1");
  let longCastlePossibleForWhite =
    !kingHasMoved("white") && !rookHasMoved("white", "a1");
  let shortCastlePossibleForBlack =
    !kingHasMoved("black") && !rookHasMoved("black", "h8");
  let longCastlePossibleForBlack =
    !kingHasMoved("black") && !rookHasMoved("black", "a8");

  if (shortCastlePossibleForWhite) castlingString += "K";
  if (longCastlePossibleForWhite) castlingString += "Q";
  if (shortCastlePossibleForBlack) castlingString += "k";
  if (longCastlePossibleForBlack) castlingString += "q";
  if (castlingString == "") castlingString += "-";
  castlingString += " ";
  fen += castlingString;

  fen += enPassantSquare == "blank" ? "-" : enPassantSquare;

  let fiftyMovesRuleCount = getFiftyMovesRuleCount();
  fen += " " + fiftyMovesRuleCount;
  let moveCount = Math.floor(moves.length / 2) + 1;
  fen += " " + moveCount;
  return fen;
}

function performCastling(
  piece,
  pieceColor,
  startingSquareId,
  destinationSquareId,
  boardSquaresArray
) {
  let rookId, rookDestinationSquareId, checkSquareId;
  if (destinationSquareId == "g1") {
    rookId = "rookh1";
    rookDestinationSquareId = "f1";
    checkSquareId = "f1";
  } else if (destinationSquareId == "c1") {
    rookId = "rooka1";
    rookDestinationSquareId = "d1";
    checkSquareId = "d1";
  } else if (destinationSquareId == "g8") {
    rookId = "rookh8";
    rookDestinationSquareId = "f8";
    checkSquareId = "f8";
  } else if (destinationSquareId == "c8") {
    rookId = "rooka8";
    rookDestinationSquareId = "d8";
    checkSquareId = "d8";
  }
  if (isKingInCheck(checkSquareId, pieceColor, boardSquaresArray)) return;
  let rook = document.getElementById(rookId);
  let rookDestinationSquare = document.getElementById(rookDestinationSquareId);
  rookDestinationSquare.appendChild(rook);
  updateBoardSquaresArray(
    rook.id.slice(-2),
    rookDestinationSquare.id,
    boardSquaresArray
  );

  const destinationSquare = document.getElementById(destinationSquareId);
  destinationSquare.appendChild(piece);
  isWhiteTurn = !isWhiteTurn;
  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray
  );
  let captured = false;
  makeMove(startingSquareId, destinationSquareId, "king", pieceColor, captured);
  checkForEndGame();
  return;
}
function performEnPassant(
  piece,
  pieceColor,
  startingSquareId,
  destinationSquareId
) {
  let file = destinationSquareId[0];
  let rank = parseInt(destinationSquareId[1]);
  rank += pieceColor === "white" ? -1 : 1;
  let squareBehindId = file + rank;

  const squareBehindElement = document.getElementById(squareBehindId);
  while (squareBehindElement.firstChild) {
    squareBehindElement.removeChild(squareBehindElement.firstChild);
  }

  let squareBehind = boardSquaresArray.find(
    (element) => element.squareId === squareBehindId
  );
  squareBehind.pieceColor = "blank";
  squareBehind.pieceType = "blank";
  squareBehind.pieceId = "blank";

  const destinationSquare = document.getElementById(destinationSquareId);
  destinationSquare.appendChild(piece);
  isWhiteTurn = !isWhiteTurn;
  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray
  );
  let captured = true;
  makeMove(startingSquareId, destinationSquareId, "pawn", pieceColor, captured);
  enPassantSquare = "blank";
  checkForEndGame();
  return;
}
function displayPromotionChoices(
  pieceId,
  pieceColor,
  startingSquareId,
  destinationSquareId,
  captured
) {
  let file = destinationSquareId[0];
  let rank = parseInt(destinationSquareId[1]);
  let rank1 = pieceColor === "white" ? rank - 1 : rank + 1;
  let rank2 = pieceColor === "white" ? rank - 2 : rank + 2;
  let rank3 = pieceColor === "white" ? rank - 3 : rank + 3;

  let squareBehindId1 = file + rank1;
  let squareBehindId2 = file + rank2;
  let squareBehindId3 = file + rank3;

  const destinationSquare = document.getElementById(destinationSquareId);
  const squareBehind1 = document.getElementById(squareBehindId1);
  const squareBehind2 = document.getElementById(squareBehindId2);
  const squareBehind3 = document.getElementById(squareBehindId3);

  let piece1 = createChessPiece("queen", pieceColor, "promotionOption");
  let piece2 = createChessPiece("knight", pieceColor, "promotionOption");
  let piece3 = createChessPiece("rook", pieceColor, "promotionOption");
  let piece4 = createChessPiece("bishop", pieceColor, "promotionOption");

  destinationSquare.appendChild(piece1);
  squareBehind1.appendChild(piece2);
  squareBehind2.appendChild(piece3);
  squareBehind3.appendChild(piece4);

  let promotionOptions = document.getElementsByClassName("promotionOption");
  for (let i = 0; i < promotionOptions.length; i++) {
    let pieceType = promotionOptions[i].classList[1];
    promotionOptions[i].addEventListener("click", function () {
      performPromotion(
        pieceId,
        pieceType,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        captured
      );
    });
  }
}

function createChessPiece(pieceType, color, pieceClass) {
  let pieceName =
    color.charAt(0).toUpperCase() +
    color.slice(1) +
    "-" +
    pieceType.charAt(0).toUpperCase() +
    pieceType.slice(1) +
    ".png";
  let pieceDiv = document.createElement("div");
  pieceDiv.className = `${pieceClass} ${pieceType}`;
  pieceDiv.setAttribute("color", color);
  let img = document.createElement("img");
  img.src = pieceName;
  img.alt = pieceType;
  pieceDiv.appendChild(img);
  return pieceDiv;
}

chessBoard.addEventListener("click", clearPromotionOptions);

function clearPromotionOptions() {
  for (let i = 0; i < boardSquares.length; i++) {
    let style = getComputedStyle(boardSquares[i]);
    let backgroundColor = style.backgroundColor;
    let rgbaColor = backgroundColor.replace("0.5)", "1)");
    boardSquares[i].style.backgroundColor = rgbaColor;
    boardSquares[i].style.opacity = 1;

    if (boardSquares[i].querySelector(".piece"))
      boardSquares[i].querySelector(".piece").style.opacity = 1;
  }
  let elementsToRemove = chessBoard.querySelectorAll(".promotionOption");
  elementsToRemove.forEach(function (element) {
    element.parentElement.removeChild(element);
  });
  allowMovement = true;
}

function updateBoardSquaresOpacity(startingSquareId) {
  for (let i = 0; i < boardSquares.length; i++) {
    if (boardSquares[i].id == startingSquareId)
      boardSquares[i].querySelector(".piece").style.opacity = 0;

    if (!boardSquares[i].querySelector(".promotionOption")) {
      boardSquares[i].style.opacity = 0.5;
    } else {
      let style = getComputedStyle(boardSquares[i]);
      let backgroundColor = style.backgroundColor;
      let rgbaColor = backgroundColor
        .replace("rgb", "rgba")
        .replace(")", ",0.5)");
      boardSquares[i].style.backgroundColor = rgbaColor;

      if (boardSquares[i].querySelector(".piece"))
        boardSquares[i].querySelector(".piece").style.opacity = 0;
    }
  }
}

function performPromotion(
  pieceId,
  pieceType,
  pieceColor,
  startingSquareId,
  destinationSquareId,
  captured
) {
  clearPromotionOptions();
  promotionPiece = pieceType;
  piece = createChessPiece(pieceType, pieceColor, "piece");

  piece.addEventListener("dragstart", drag);
  piece.setAttribute("draggable", true);
  piece.firstChild.setAttribute("draggable", false);
  piece.id = pieceType + pieceId;

  const startingSquare = document.getElementById(startingSquareId);
  while (startingSquare.firstChild) {
    startingSquare.removeChild(startingSquare.firstChild);
  }
  const destinationSquare = document.getElementById(destinationSquareId);

  if (captured) {
    let children = destinationSquare.children;
    for (let i = 0; i < children.length; i++) {
      if (!children[i].classList.contains("coordinate")) {
        destinationSquare.removeChild(children[i]);
      }
    }
  }
  // while(destinationSquare.firstChild){
  //   destinationSquare.removeChild(destinationSquare.firstChild);
  // }
  destinationSquare.appendChild(piece);
  isWhiteTurn = !isWhiteTurn;
  updateBoardSquaresArray(
    startingSquareId,
    destinationSquareId,
    boardSquaresArray,
    pieceType
  );
  makeMove(
    startingSquareId,
    destinationSquareId,
    pieceType,
    pieceColor,
    captured,
    pieceType
  );
  checkForEndGame();
  return;
}

function deepCopyArray(array) {
  let arrayCopy = array.map((element) => {
    return { ...element };
  });
  return arrayCopy;
}

function setupBoardSquares() {
  for (let i = 0; i < boardSquares.length; i++) {
    boardSquares[i].addEventListener("dragover", allowDrop);
    boardSquares[i].addEventListener("drop", drop);
    let row = 8 - Math.floor(i / 8);
    let column = String.fromCharCode(97 + (i % 8));
    let square = boardSquares[i];
    square.id = column + row;
  }
}
function setupPieces() {
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].addEventListener("dragstart", drag);
    pieces[i].setAttribute("draggable", true);
    pieces[i].id =
      pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
  }
  for (let i = 0; i < piecesImages.length; i++) {
    piecesImages[i].setAttribute("draggable", false);
  }
}
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  if (!allowMovement) return;

  const piece = ev.target;
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];
  const pieceId = piece.id;
  if (
    (isWhiteTurn && pieceColor == "white") ||
    (!isWhiteTurn && pieceColor == "black")
  ) {
    const startingSquareId = piece.parentNode.id;
    ev.dataTransfer.setData("text", piece.id + "|" + startingSquareId);
    const pieceObject = {
      pieceColor: pieceColor,
      pieceType: pieceType,
      pieceId: pieceId,
    };
    let legalSquares = getPossibleMoves(
      startingSquareId,
      pieceObject,
      boardSquaresArray
    );
    let legalSquaresJson = JSON.stringify(legalSquares);
    ev.dataTransfer.setData("application/json", legalSquaresJson);
  }
}

function drop(ev) {
  ev.preventDefault();
  let data = ev.dataTransfer.getData("text");
  let [pieceId, startingSquareId] = data.split("|");
  let legalSquaresJson = ev.dataTransfer.getData("application/json");
  if (legalSquaresJson.length == 0) return;
  let legalSquares = JSON.parse(legalSquaresJson);

  const piece = document.getElementById(pieceId);
  const pieceColor = piece.getAttribute("color");
  const pieceType = piece.classList[1];

  const destinationSquare = ev.currentTarget;
  let destinationSquareId = destinationSquare.id;

  legalSquares = isMoveValidAgainstCheck(
    legalSquares,
    startingSquareId,
    pieceColor,
    pieceType
  );

  if (pieceType == "king") {
    let isCheck = isKingInCheck(
      destinationSquareId,
      pieceColor,
      boardSquaresArray
    );
    if (isCheck) return;
  }

  let squareContent = getPieceAtSquare(destinationSquareId, boardSquaresArray);
  if (
    squareContent.pieceColor == "blank" &&
    legalSquares.includes(destinationSquareId)
  ) {
    let isCheck = false;
    if (pieceType == "king")
      isCheck = isKingInCheck(startingSquareId, pieceColor, boardSquaresArray);
    if (
      pieceType == "king" &&
      !kingHasMoved(pieceColor) &&
      castlingSquares.includes(destinationSquareId) &&
      !isCheck
    ) {
      performCastling(
        piece,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        boardSquaresArray
      );
      return;
    }
    if (
      pieceType == "king" &&
      !kingHasMoved(pieceColor) &&
      castlingSquares.includes(destinationSquareId) &&
      isCheck
    )
      return;

    if (pieceType == "pawn" && enPassantSquare == destinationSquareId) {
      performEnPassant(
        piece,
        pieceColor,
        startingSquareId,
        destinationSquareId
      );
      return;
    }
    enPassantSquare = "blank";
    if (
      pieceType == "pawn" &&
      (destinationSquareId.charAt(1) == 8 || destinationSquareId.charAt(1) == 1)
    ) {
      allowMovement = false;
      displayPromotionChoices(
        pieceId,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        false
      );
      updateBoardSquaresOpacity(startingSquareId);
      return;
    }
    destinationSquare.appendChild(piece);
    isWhiteTurn = !isWhiteTurn;
    updateBoardSquaresArray(
      startingSquareId,
      destinationSquareId,
      boardSquaresArray
    );
    let captured = false;
    makeMove(
      startingSquareId,
      destinationSquareId,
      pieceType,
      pieceColor,
      captured
    );
    checkForEndGame();
    return;
  }
  if (
    squareContent.pieceColor != "blank" &&
    legalSquares.includes(destinationSquareId)
  ) {
    if (
      pieceType == "pawn" &&
      (destinationSquareId.charAt(1) == 8 || destinationSquareId.charAt(1) == 1)
    ) {
      allowMovement = false;
      displayPromotionChoices(
        pieceId,
        pieceColor,
        startingSquareId,
        destinationSquareId,
        true
      );
      updateBoardSquaresOpacity(startingSquareId);
      return;
    }

    let children = destinationSquare.children;
    for (let i = 0; i < children.length; i++) {
      if (!children[i].classList.contains("coordinate")) {
        destinationSquare.removeChild(children[i]);
      }
    }
    // while (destinationSquare.firstChild) {
    //   if(!destinationSquare.firstChild.classList.contains("coordinate"))
    //    destinationSquare.removeChild(destinationSquare.firstChild);
    // }
    destinationSquare.appendChild(piece);
    isWhiteTurn = !isWhiteTurn;
    updateBoardSquaresArray(
      startingSquareId,
      destinationSquareId,
      boardSquaresArray
    );
    let captured = true;
    makeMove(
      startingSquareId,
      destinationSquareId,
      pieceType,
      pieceColor,
      captured
    );
    checkForEndGame();
    return;
  }
}

function getPossibleMoves(startingSquareId, piece, boardSquaresArray) {
  const pieceColor = piece.pieceColor;
  const pieceType = piece.pieceType;
  let legalSquares = [];
  if (pieceType == "rook") {
    legalSquares = getRookMoves(
      startingSquareId,
      pieceColor,
      boardSquaresArray
    );
    return legalSquares;
  }
  if (pieceType == "bishop") {
    legalSquares = getBishopMoves(
      startingSquareId,
      pieceColor,
      boardSquaresArray
    );
    return legalSquares;
  }
  if (pieceType == "queen") {
    legalSquares = getQueenMoves(
      startingSquareId,
      pieceColor,
      boardSquaresArray
    );
    return legalSquares;
  }
  if (pieceType == "knight") {
    legalSquares = getKnightMoves(
      startingSquareId,
      pieceColor,
      boardSquaresArray
    );
    return legalSquares;
  }

  if (pieceType == "pawn") {
    legalSquares = getPawnMoves(
      startingSquareId,
      pieceColor,
      boardSquaresArray
    );
    return legalSquares;
  }
  if (pieceType == "king") {
    legalSquares = getKingMoves(
      startingSquareId,
      pieceColor,
      boardSquaresArray
    );
    return legalSquares;
  }
}

function getPawnMoves(startingSquareId, pieceColor, boardSquaresArray) {
  let diogonalSquares = checkPawnDiagonalCaptures(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let forwardSquares = checkPawnForwardMoves(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let legalSquares = [...diogonalSquares, ...forwardSquares];
  return legalSquares;
}

function checkPawnDiagonalCaptures(
  startingSquareId,
  pieceColor,
  boardSquaresArray
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let legalSquares = [];
  let currentFile = file;
  let currentRank = rankNumber;
  let currentSquareId = currentFile + currentRank;

  const direction = pieceColor == "white" ? 1 : -1;

  currentRank += direction;
  for (let i = -1; i <= 1; i += 2) {
    currentFile = String.fromCharCode(file.charCodeAt(0) + i);
    if (currentFile >= "a" && currentFile <= "h") {
      currentSquareId = currentFile + currentRank;
      let currentSquare = boardSquaresArray.find(
        (element) => element.squareId === currentSquareId
      );
      let squareContent = currentSquare.pieceColor;
      if (squareContent != "blank" && squareContent != pieceColor)
        legalSquares.push(currentSquareId);

      if (squareContent == "blank") {
        currentSquareId = currentFile + rank;
        let pawnStartingSquareRank = rankNumber + direction * 2;
        let pawnStartingSquareId = currentFile + pawnStartingSquareRank;

        if (
          enPassantPossible(currentSquareId, pawnStartingSquareId, direction)
        ) {
          let pawnStartingSquareRank = rankNumber + direction;
          let enPassantSquare = currentFile + pawnStartingSquareRank;
          legalSquares.push(enPassantSquare);
        }
      }
    }
  }
  return legalSquares;
}
function enPassantPossible(currentSquareId, pawnStartingSquareId, direction) {
  if (moves.length == 0) return false;
  let lastMove = moves[moves.length - 1];
  if (
    !(lastMove.to === currentSquareId && lastMove.from === pawnStartingSquareId)
  )
    return false;

  let file = currentSquareId[0];
  let rank = parseInt(currentSquareId[1]);
  rank += direction;
  let squareBehindId = file + rank;
  enPassantSquare = squareBehindId;
  return true;
}

function checkPawnForwardMoves(
  startingSquareId,
  pieceColor,
  boardSquaresArray
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let legalSquares = [];

  let currentFile = file;
  let currentRank = rankNumber;
  let currentSquareId = currentFile + currentRank;

  const direction = pieceColor == "white" ? 1 : -1;
  currentRank += direction;
  currentSquareId = currentFile + currentRank;
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === currentSquareId
  );
  let squareContent = currentSquare.pieceColor;
  if (squareContent != "blank") return legalSquares;
  legalSquares.push(currentSquareId);
  if (
    !(
      (rankNumber == 2 && pieceColor == "white") ||
      (rankNumber == 7 && pieceColor == "black")
    )
  )
    return legalSquares;
  currentRank += direction;
  currentSquareId = currentFile + currentRank;
  currentSquare = boardSquaresArray.find(
    (element) => element.squareId === currentSquareId
  );
  squareContent = currentSquare.pieceColor;
  if (squareContent != "blank")
    if (squareContent != "blank") return legalSquares;
  legalSquares.push(currentSquareId);
  return legalSquares;
}

function getKnightMoves(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charCodeAt(0) - 97;
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];

  const moves = [
    [-2, 1],
    [-1, 2],
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
  ];
  moves.forEach((move) => {
    currentFile = file + move[0];
    currentRank = rankNumber + move[1];
    if (
      currentFile >= 0 &&
      currentFile <= 7 &&
      currentRank > 0 &&
      currentRank <= 8
    ) {
      let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank;
      let currentSquare = boardSquaresArray.find(
        (element) => element.squareId === currentSquareId
      );
      let squareContent = currentSquare.pieceColor;
      if (squareContent != "blank" && squareContent == pieceColor)
        return legalSquares;
      legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank);
    }
  });
  return legalSquares;
}
function getRookMoves(startingSquareId, pieceColor, boardSquaresArray) {
  let moveToEighthRankSquares = moveToEighthRank(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let moveToFirstRankSquares = moveToFirstRank(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let moveToAFileSquares = moveToAFile(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let moveToHFileSquares = moveToHFile(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let legalSquares = [
    ...moveToEighthRankSquares,
    ...moveToFirstRankSquares,
    ...moveToAFileSquares,
    ...moveToHFileSquares,
  ];
  return legalSquares;
}

function getBishopMoves(startingSquareId, pieceColor, boardSquaresArray) {
  let moveToEighthRankHFileSquares = moveToEighthRankHFile(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let moveToEighthRankAFileSquares = moveToEighthRankAFile(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let moveToFirstRankHFileSquares = moveToFirstRankHFile(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let moveToFirstRankAFileSquares = moveToFirstRankAFile(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let legalSquares = [
    ...moveToEighthRankHFileSquares,
    ...moveToEighthRankAFileSquares,
    ...moveToFirstRankHFileSquares,
    ...moveToFirstRankAFileSquares,
  ];
  return legalSquares;
}
function getQueenMoves(startingSquareId, pieceColor, boardSquaresArray) {
  let bishopMoves = getBishopMoves(
    startingSquareId,
    pieceColor,
    boardSquaresArray
  );
  let rookMoves = getRookMoves(startingSquareId, pieceColor, boardSquaresArray);
  let legalSquares = [...bishopMoves, ...rookMoves];
  return legalSquares;
}

function getKingMoves(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charCodeAt(0) - 97; // get the second character of the string
  const rank = startingSquareId.charAt(1); // get the second character of the string
  const rankNumber = parseInt(rank); // convert the second character to a number
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];
  const moves = [
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [1, 0],
  ];

  moves.forEach((move) => {
    let currentFile = file + move[0];
    let currentRank = rankNumber + move[1];

    if (
      currentFile >= 0 &&
      currentFile <= 7 &&
      currentRank > 0 &&
      currentRank <= 8
    ) {
      let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank;
      let currentSquare = boardSquaresArray.find(
        (element) => element.squareId === currentSquareId
      );
      let squareContent = currentSquare.pieceColor;
      if (squareContent != "blank" && squareContent == pieceColor) {
        return legalSquares;
      }
      legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank);
    }
  });
  let shortCastleSquare = isShortCastlePossible(pieceColor, boardSquaresArray);
  let longCastleSquare = isLongCastlePossible(pieceColor, boardSquaresArray);
  if (shortCastleSquare != "blank") legalSquares.push(shortCastleSquare);
  if (longCastleSquare != "blank") legalSquares.push(longCastleSquare);

  return legalSquares;
}
function isShortCastlePossible(pieceColor, boardSquaresArray) {
  let rank = pieceColor === "white" ? "1" : "8";
  let fSquare = boardSquaresArray.find(
    (element) => element.squareId === `f${rank}`
  );
  let gSquare = boardSquaresArray.find(
    (element) => element.squareId === `g${rank}`
  );
  if (
    fSquare.pieceColor !== "blank" ||
    gSquare.pieceColor !== "blank" ||
    kingHasMoved(pieceColor) ||
    rookHasMoved(pieceColor, `h${rank}`)
  ) {
    return "blank";
  }

  return `g${rank}`;
}
function isLongCastlePossible(pieceColor, boardSquaresArray) {
  let rank = pieceColor === "white" ? "1" : "8";
  let dSquare = boardSquaresArray.find(
    (element) => element.squareId === `d${rank}`
  );
  let cSquare = boardSquaresArray.find(
    (element) => element.squareId === `c${rank}`
  );
  let bSquare = boardSquaresArray.find(
    (element) => element.squareId === `b${rank}`
  );
  if (
    dSquare.pieceColor !== "blank" ||
    cSquare.pieceColor !== "blank" ||
    bSquare.pieceColor !== "blank" ||
    kingHasMoved(pieceColor) ||
    rookHasMoved(pieceColor, `a${rank}`)
  ) {
    return "blank";
  }

  return `c${rank}`;
}
function kingHasMoved(pieceColor) {
  let result = moves.find(
    (element) =>
      element.pieceColor === pieceColor && element.pieceType === "king"
  );
  if (result != undefined) return true;
  return false;
}
function rookHasMoved(pieceColor, startingSquareId) {
  let result = moves.find(
    (element) =>
      element.pieceColor === pieceColor &&
      element.pieceType === "rook" &&
      element.from === startingSquareId
  );
  if (result != undefined) return true;
  return false;
}

function moveToEighthRank(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentRank = rankNumber;
  let legalSquares = [];
  while (currentRank != 8) {
    currentRank++;
    let currentSquareId = file + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToFirstRank(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentRank = rankNumber;
  let legalSquares = [];
  while (currentRank != 1) {
    currentRank--;
    let currentSquareId = file + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToAFile(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  let currentFile = file;
  let legalSquares = [];

  while (currentFile != "a") {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(currentFile.length - 1) - 1
    );
    let currentSquareId = currentFile + rank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToHFile(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  let currentFile = file;
  let legalSquares = [];
  while (currentFile != "h") {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(currentFile.length - 1) + 1
    );
    let currentSquareId = currentFile + rank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToEighthRankAFile(
  startingSquareId,
  pieceColor,
  boardSquaresArray
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];
  while (!(currentFile == "a" || currentRank == 8)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(currentFile.length - 1) - 1
    );
    currentRank++;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToEighthRankHFile(
  startingSquareId,
  pieceColor,
  boardSquaresArray
) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];
  while (!(currentFile == "h" || currentRank == 8)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(currentFile.length - 1) + 1
    );
    currentRank++;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToFirstRankAFile(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];
  while (!(currentFile == "a" || currentRank == 1)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(currentFile.length - 1) - 1
    );
    currentRank--;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function moveToFirstRankHFile(startingSquareId, pieceColor, boardSquaresArray) {
  const file = startingSquareId.charAt(0);
  const rank = startingSquareId.charAt(1);
  const rankNumber = parseInt(rank);
  let currentFile = file;
  let currentRank = rankNumber;
  let legalSquares = [];
  while (!(currentFile == "h" || currentRank == 1)) {
    currentFile = String.fromCharCode(
      currentFile.charCodeAt(currentFile.length - 1) + 1
    );
    currentRank--;
    let currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find(
      (element) => element.squareId === currentSquareId
    );
    let squareContent = currentSquare.pieceColor;
    if (squareContent != "blank" && squareContent == pieceColor)
      return legalSquares;
    legalSquares.push(currentSquareId);
    if (squareContent != "blank" && squareContent != pieceColor)
      return legalSquares;
  }
  return legalSquares;
}
function getPieceAtSquare(squareId, boardSquaresArray) {
  let currentSquare = boardSquaresArray.find(
    (element) => element.squareId === squareId
  );
  const color = currentSquare.pieceColor;
  const pieceType = currentSquare.pieceType;
  const pieceId = currentSquare.pieceId;
  return { pieceColor: color, pieceType: pieceType, pieceId: pieceId };
}

function isKingInCheck(squareId, pieceColor, boardSquaresArray) {
  let legalSquares = getRookMoves(squareId, pieceColor, boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
    if (
      (pieceProperties.pieceType == "rook" ||
        pieceProperties.pieceType == "queen") &&
      pieceColor != pieceProperties.pieceColor
    )
      return true;
  }
  legalSquares = getBishopMoves(squareId, pieceColor, boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
    if (
      (pieceProperties.pieceType == "bishop" ||
        pieceProperties.pieceType == "queen") &&
      pieceColor != pieceProperties.pieceColor
    )
      return true;
  }
  legalSquares = getKnightMoves(squareId, pieceColor, boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
    if (
      pieceProperties.pieceType == "knight" &&
      pieceColor != pieceProperties.pieceColor
    )
      return true;
  }
  legalSquares = checkPawnDiagonalCaptures(
    squareId,
    pieceColor,
    boardSquaresArray
  );
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
    if (
      pieceProperties.pieceType == "pawn" &&
      pieceColor != pieceProperties.color
    )
      return true;
  }
  legalSquares = getKingMoves(squareId, pieceColor, boardSquaresArray);
  for (let squareId of legalSquares) {
    let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
    if (
      pieceProperties.pieceType == "king" &&
      pieceColor != pieceProperties.color
    )
      return true;
  }
  return false;
}
function getkingLastMove(color) {
  let kingLastMove = moves.findLast(
    (element) => element.pieceType === "king" && element.pieceColor === color
  );
  if (kingLastMove == undefined) return isWhiteTurn ? "e1" : "e8";
  return kingLastMove.to;
}
function isMoveValidAgainstCheck(
  legalSquares,
  startingSquareId,
  pieceColor,
  pieceType
) {
  let kingSquare = isWhiteTurn
    ? getkingLastMove("white")
    : getkingLastMove("black");
  let boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
  let legalSquaresCopy = legalSquares.slice();
  legalSquaresCopy.forEach((element) => {
    let destinationId = element;
    boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
    updateBoardSquaresArray(
      startingSquareId,
      destinationId,
      boardSquaresArrayCopy
    );
    if (
      pieceType != "king" &&
      isKingInCheck(kingSquare, pieceColor, boardSquaresArrayCopy)
    ) {
      legalSquares = legalSquares.filter((item) => item != destinationId);
    }
    if (
      pieceType == "king" &&
      isKingInCheck(destinationId, pieceColor, boardSquaresArrayCopy)
    ) {
      legalSquares = legalSquares.filter((item) => item != destinationId);
    }
  });
  return legalSquares;
}
function checkForEndGame() {
  checkForCheckMateAndStaleMate();
  let currentPosition = generateFEN(boardSquaresArray);
  let moveCount = Math.floor(moves.length/2)+1;
  getEvaluation(currentPosition,function(lines,evaluations,scoreString){
    displayEvaluation(lines,evaluations,scoreString,isWhiteTurn,moveCount);
  });
  positionArray.push(currentPosition);
  let threeFoldRepetition = isThreefoldRepetition();
  let insufficientMaterial = hasInsufficientMaterial(currentPosition);
  let fiftyMovesRuleCount = currentPosition.split(" ")[4];
  let fiftyMovesRule = fiftyMovesRuleCount != 100 ? false : true;
  let isDraw = threeFoldRepetition || insufficientMaterial || fiftyMovesRule;
  if (isDraw) {
    allowMovement = false;
    showAlert("Draw");

    document.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
    document.addEventListener("drop", function (event) {
      event.preventDefault();
    });
  }
}

function checkForCheckMateAndStaleMate() {
  let kingSquare = isWhiteTurn
    ? getkingLastMove("white")
    : getkingLastMove("black");
  let pieceColor = isWhiteTurn ? "white" : "black";
  let boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
  let kingIsCheck = isKingInCheck(
    kingSquare,
    pieceColor,
    boardSquaresArrayCopy
  );
  let possibleMoves = getAllPossibleMoves(boardSquaresArrayCopy, pieceColor);
  if (possibleMoves.length > 0) return;
  let message = "";
  if (kingIsCheck)
    isWhiteTurn ? (message = "Black Wins!") : (message = "White Wins!");
  else message = "Draw";
  showAlert(message);
}
function getFiftyMovesRuleCount() {
  let count = 0;
  for (let i = 0; i < moves.length; i++) {
    count++;
    if (
      moves[i].captured ||
      moves[i].pieceType === "pawn" ||
      moves[i].promotedTo != "blank"
    )
      count = 0;
  }
  return count;
}
function isThreefoldRepetition() {
  return positionArray.some((string) => {
    const fen = string.split(" ").slice(0, 4).join(" ");
    return (
      positionArray.filter(
        (element) => element.split(" ").slice(0, 4).join(" ") === fen
      ).length >= 3
    );
  });
}
function hasInsufficientMaterial(fen) {
  const piecePlacement = fen.split(" ")[0];

  const whiteBishops = piecePlacement
    .split("")
    .filter((char) => char === "B").length;
  const blackBishops = piecePlacement
    .split("")
    .filter((char) => char === "b").length;
  const whiteKnights = piecePlacement
    .split("")
    .filter((char) => char === "N").length;
  const blackKnights = piecePlacement
    .split("")
    .filter((char) => char === "n").length;
  const whiteQueens = piecePlacement
    .split("")
    .filter((char) => char === "Q").length;
  const blackQueens = piecePlacement
    .split("")
    .filter((char) => char === "q").length;
  const whiteRooks = piecePlacement
    .split("")
    .filter((char) => char === "R").length;
  const blackRooks = piecePlacement
    .split("")
    .filter((char) => char === "r").length;
  const whitePawns = piecePlacement
    .split("")
    .filter((char) => char === "P").length;
  const blackPawns = piecePlacement
    .split("")
    .filter((char) => char === "p").length;

  if (
    whiteQueens +
      blackQueens +
      whiteRooks +
      blackRooks +
      whitePawns +
      blackPawns >
    0
  ) {
    return false;
  }

  if (whiteKnights + blackKnights > 1) {
    return false;
  }
  if (whiteKnights + blackKnights > 1) {
    return false;
  }

  if ((whiteBishops > 0 || blackBishops > 0) && whiteKnights + blackKnights > 0)
    return false;

  if (whiteBishops > 1 || blackBishops > 1) return false;

  if (whiteBishops === 1 && blackBishops === 1) {
    let whiteBishopSquareColor, blackBishopSquareColor;

    let whiteBishopSquare = boardSquaresArray.find(
      (element) =>
        element.pieceType === "bishop" && element.pieceColor === "white"
    );
    let blackBishopSquare = boardSquaresArray.find(
      (element) =>
        element.pieceType === "bishop" && element.pieceColor === "black"
    );

    whiteBishopSquareColor = getSqaureColor(whiteBishopSquare.squareId);
    blackBishopSquareColor = getSqaureColor(blackBishopSquare.squareId);

    if (whiteBishopSquareColor !== blackBishopSquareColor) {
      return false;
    }
  }
  return true;
}
function getSqaureColor(squareId) {
  let squareElement = document.getElementById(squareId);
  let squareColor = squareElement.classList.contains("white")
    ? "white"
    : "black";
  return squareColor;
}

function getAllPossibleMoves(squaresArray, color) {
  return squaresArray
    .filter((square) => square.pieceColor === color)
    .flatMap((square) => {
      const { pieceColor, pieceType, pieceId } = getPieceAtSquare(
        square.squareId,
        squaresArray
      );
      if (pieceId === "blank") return [];
      let squaresArrayCopy = deepCopyArray(squaresArray);
      const pieceObject = {
        pieceColor: pieceColor,
        pieceType: pieceType,
        pieceId: pieceId,
      };
      let legalSquares = getPossibleMoves(
        square.squareId,
        pieceObject,
        squaresArrayCopy
      );
      legalSquares = isMoveValidAgainstCheck(
        legalSquares,
        square.squareId,
        pieceColor,
        pieceType
      );
      return legalSquares;
    });
}
function showAlert(message) {
  const alert = document.getElementById("alert");
  alert.innerHTML = message;
  alert.style.display = "block";

  setTimeout(function () {
    alert.style.display = "none";
  }, 3000);
}

function getEvaluation(fen, callback) {
  let engine = new Worker("./node_modules/stockfish/src/stockfish-nnue-16.js");
  let evaluations = [];
  let lines = [];
  let possibleMoves =3;
  engine.onmessage = function (event) {
    let message = event.data;
 
    if (message.startsWith("info depth 10")) {

      let multipvIndex = message.indexOf("multipv");
      if (multipvIndex !== -1) {
        let multipvString = message.slice(multipvIndex).split(" ")[1];
        let multipv = parseInt(multipvString);
        let scoreIndex = message.indexOf("score cp");
        if (scoreIndex !== -1) {
          var scoreString = message.slice(scoreIndex).split(" ")[2];
          let evaluation = parseInt(scoreString) / 100;
          evaluation = isWhiteTurn ? evaluation : evaluation * -1;
          evaluations[multipv - 1] = evaluation;
        } else {

          scoreIndex = message.indexOf("score mate");
          scoreString = message.slice(scoreIndex).split(" ")[2];
          evaluation = parseInt(scoreString);
          evaluation = Math.abs(evaluation);
          evaluations[multipv - 1] = "#" + evaluation;
        }
        let pvIndex = message.indexOf(" pv ");
        if (pvIndex !== -1) {

          let pvString = message.slice(pvIndex + 4).split(" ");
          lines[multipv-1] = pvString.join(" ");
          if (evaluations.length === possibleMoves && lines.length===possibleMoves) {    
            callback(lines,evaluations,scoreString);
          }
        }
      }
    }
    if(message.startsWith("Nodes searched:")){
      let parts = message.split(" ");
      let numberOfMoves = parseInt(parts[2]);
      if(numberOfMoves<3) {
        possibleMoves = numberOfMoves;
        line1.innerHTML="";line2.innerHTML="";line3.innerHTML="";
        eval1.innerHTML=""; eval2.innerHTML=""; eval3.innerHTML="";
      }
    }

  };

  engine.postMessage("uci");
  engine.postMessage("isready");
  engine.postMessage("ucinewgame");
  engine.postMessage(`setoption name multipv value 3`);
  engine.postMessage("position fen " + fen);
  engine.postMessage("go perft 1");
  engine.postMessage("go depth 10");

}

function displayEvaluation (lines,evaluations,scoreString,whiteTurn=true,moveNumber=1) {
  let blackBar = document.querySelector(".blackBar");
  let blackBarHeight = 50 - (evaluations[0] / 15) * 100;
  blackBarHeight =
    blackBarHeight > 100 ? (blackBarHeight = 100) : blackBarHeight;
  blackBarHeight =
    blackBarHeight <0 ? (blackBarHeight = 0) : blackBarHeight;
  blackBar.style.height = blackBarHeight + "%";
  let evalNum =document.querySelector(".evalNum");
  evalNum.innerHTML = evaluations[0];
  for (let i=0;i<lines.length;i++) {
    let eval = document.getElementById("eval"+(i+1));
    let line =document.getElementById("line"+(i+1));
    eval.innerHTML = evaluations[i];
     line.innerHTML = convertStockfishToStandardNotation(lines[i],moveNumber,whiteTurn);
    //line.innerHTML = lines[i];

    document.getElementById("eval").innerHTML = evaluations[0];
    if(Math.abs(evaluations[0]<0.5))
      document.getElementById("evalText").innerHTML = "Equal";
    if(evaluations[0]<1 && evaluations[0]>=0.5)
     document.getElementById("evalText").innerHTML = "White is slightly better";
    if(evaluations[0]> -1 && evaluations[0]<=-0.5)
      document.getElementById("evalText").innerHTML = "Black is slightly better";
    if(evaluations[0]<2 && evaluations[0]>=1)
      document.getElementById("evalText").innerHTML = "White is much better";
    if(evaluations[0]> -2 && evaluations[0]<= -1)
      document.getElementById("evalText").innerHTML = "Black is much better";
    if(evaluations[0]>2)
      document.getElementById("evalText").innerHTML = "White is winning";
    if(evaluations[0]< -2)
      document.getElementById("evalText").innerHTML = "Black is winning";

    if(evaluations[0].toString().includes("#")) {
      const mateInMoves = evaluations[0].slice(1);
      const isWhiteWinning = (parseInt(scoreString)>0 && isWhiteTurn) ||(parseInt(scoreString)<0 && !isWhiteTurn);
      const winningColor = isWhiteWinning ? "White" : "Black";
      document.getElementById("evalText").innerHTML = `${winningColor} can mate in ${mateInMoves} moves`;
      blackBarHeight = isWhiteWinning? 0 : 100;
      blackBar.style.height = blackBarHeight+"%";
    }
  }

}

function convertStockfishToStandardNotation(stockfishMoves,moveNumber,whiteTurn){
  let standardMoves = "";
  let moves = stockfishMoves.split(" ");
  let boardSquaresArrayCopy = deepCopyArray(boardSquaresArray);
  for(let i=0;i<moves.length;i++) {
    let move = moves[i];
    let from = move.substring(0,2);
    let to =  move.substring(2,4);
    let promotion = move.length>4? move.charAt(4) : null;
    let fromSquare = boardSquaresArrayCopy.find(square=>square.squareId===from);
    let toSquare = getPieceAtSquare(to,boardSquaresArrayCopy);
    if(fromSquare&&toSquare) {
      let fromPiece = fromSquare.pieceType;
      switch(fromPiece.toLowerCase()) {
        case "pawn":
          fromPiece="";
          break;
          case "knight":
            fromPiece="N";
            break;
          case "bishop":
            fromPiece="B";
            break;
          case "rook":
            fromPiece="R";
            break;   
          case "queen":
            fromPiece="Q";
            break;  
          case "king":
            fromPiece="K";
            break;
      }
      let captureSymbol="";
      if((toSquare.pieceType !=="blank") || (toSquare.pieceType=="blank" && fromSquare.pieceType.toLowerCase()==="pawn" && from.charAt(0)!=to.charAt(0))){
        captureSymbol="x";
        if(fromSquare.pieceType.toLowerCase()==="pawn") {
          fromPiece = from.charAt(0);
        }
      }
      let standardMove = `${fromPiece}${captureSymbol}${to}`;
      if(promotion){
        switch(promotion.toLowerCase()){
          case "q":
          standardMove+="=Q";
          break;
          case "r":
            standardMove+="=R";
            break;
          case "b":
            standardMove+="=B";
            break;
          case "n":
            standardMove+="=N";
            break;  
        }
      }
      let kingColor = fromSquare.pieceColor == "white" ? "black":"white";
      let kingSquareId = getKingSquare(kingColor,boardSquaresArrayCopy);
      updateBoardSquaresArray(from,to,boardSquaresArrayCopy);

      if(isKingInCheck(kingSquareId,kingColor,boardSquaresArrayCopy)) {
        standardMove +="+";
      }
      if((standardMove =="Kg8" && fromSquare.squareId=="e8")||(standardMove == "Kg1" && fromSquare.squareId=="e1")) {
        if(standardMove ==="Kg8")
         updateBoardSquaresArray("h8","f8",boardSquaresArrayCopy);
        else
         updateBoardSquaresArray("h1","f1",boardSquaresArrayCopy);
         standardMove = "O-O";

      }
      if((standardMove =="Kc8" && fromSquare.squareId=="e8")||(standardMove == "Kc1" && fromSquare.squareId=="e1")) {
        if(standardMove ==="Kc8")
         updateBoardSquaresArray("a8","d8",boardSquaresArrayCopy);
        else
         updateBoardSquaresArray("a1","d1",boardSquaresArrayCopy);
        standardMove = "O-O-O";
      }
      standardMoves += `${(whiteTurn && i%2==0)||(!whiteTurn && i%2 ==1)? " "+moveNumber++ + "." : " "}${standardMove}`;

      if(!whiteTurn && i==0) standardMoves = `${moveNumber+". ... "}${standardMove} `;
    }
  }
  return standardMoves.trim();
}

function getKingSquare(color,squareArray) {
  let kingSquare = squareArray.find(square=>square.pieceType.toLowerCase()==="king" && square.pieceColor === color);

  return kingSquare ? kingSquare.squareId : null;
}




















