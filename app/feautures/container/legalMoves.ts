import { Board } from './boardSetup';
export type BoardType = ReturnType<typeof Board>;

export const pawnMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  const { i, j } = cell;
  const moves: { i: number; j: number }[] = []; //array of possible moves
  const { color } = game[game.length - 1][i][j]; //current color
  const direction = color === 'white' ? -1 : 1; //white goes up, black goes down
  const board = game[game.length - 1]; //current board
  const cellIsEmpty = (i: number, j: number) => board[i][j]?.color === null;
  const cellIsEnemy = (i: number, j: number) =>
    board[i][j]?.color && board[i][j]?.color !== color;

  if (cellIsEmpty(i, j)) {
    return moves;
  }

  if (cellIsEmpty(i + direction, j)) {
    moves.push({ i: i + direction, j }); //one step
    if (cellIsEmpty(i + 2 * direction, j) && !board[i][j].pieceMoved) {
      moves.push({ i: i + 2 * direction, j }); //two steps
    }
  }
  if (cellIsEnemy(i + direction, j - 1)) {
    moves.push({ i: i + direction, j: j - 1 }); //diagonal left
  }
  if (cellIsEnemy(i + direction, j + 1)) {
    moves.push({ i: i + direction, j: j + 1 }); //diagonal right
  }

  //en passant
  const last = game[game.length > 2 ? game.length - 3 : game.length - 2];
  if (i === 3 || i === 4) {
    if (
      last[i + direction * 2][j + 1].piece === 'pawn' &&
      last[i + direction * 2][j + 1].color !== color &&
      cellIsEmpty(i + direction * 2, j + 1) &&
      cellIsEmpty(i + direction, j + 1) &&
      last[i + direction][j + 1].piece === null &&
      cellIsEnemy(i, j + 1) &&
      board[i][j + 1].piece === 'pawn' &&
      last[i][j + 1].piece === null
    ) {
      moves.push({ i: i + direction, j: j + 1 });
    }
  }

  if (i === 3 || i === 4) {
    if (
      last[i + direction * 2][j - 1].piece === 'pawn' &&
      last[i + direction * 2][j - 1].color !== color &&
      cellIsEmpty(i + direction * 2, j - 1) &&
      cellIsEmpty(i + direction, j - 1) &&
      last[i + direction][j - 1].piece === null &&
      cellIsEnemy(i, j - 1) &&
      board[i][j - 1].piece === 'pawn' &&
      last[i][j - 1].piece === null
    ) {
      moves.push({ i: i + direction, j: j - 1 });
    }
  }

  return moves;
};

export const rookMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  const { i, j } = cell;
  const moves: { i: number; j: number }[] = []; //array of possible moves
  const { color } = game[game.length - 1][i][j]; //current color
  const board = game[game.length - 1]; //current board
  const cellIsEmpty = (i: number, j: number) => board[i][j]?.color === null;
  const cellIsEnemy = (i: number, j: number) =>
    board[i][j]?.color && board[i][j]?.color !== color;

  if (cellIsEmpty(i, j)) {
    return moves;
  }

  //up
  for (let k = i - 1; k >= 0; k--) {
    if (cellIsEmpty(k, j)) {
      moves.push({ i: k, j });
    } else if (cellIsEnemy(k, j)) {
      moves.push({ i: k, j });
      break;
    } else {
      break;
    }
  }

  //down
  for (let k = i + 1; k < 8; k++) {
    if (cellIsEmpty(k, j)) {
      moves.push({ i: k, j });
    } else if (cellIsEnemy(k, j)) {
      moves.push({ i: k, j });
      break;
    } else {
      break;
    }
  }

  //left
  for (let k = j - 1; k >= 0; k--) {
    if (cellIsEmpty(i, k)) {
      moves.push({ i, j: k });
    } else if (cellIsEnemy(i, k)) {
      moves.push({ i, j: k });
      break;
    } else {
      break;
    }
  }

  //right
  for (let k = j + 1; k < 8; k++) {
    if (cellIsEmpty(i, k)) {
      moves.push({ i, j: k });
    } else if (cellIsEnemy(i, k)) {
      moves.push({ i, j: k });
      break;
    } else {
      break;
    }
  }

  return moves;
};

export const knightMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  const { i, j } = cell;
  const moves: { i: number; j: number }[] = []; //array of possible moves
  const { color } = game[game.length - 1][i][j]; //current color
  const board = game[game.length - 1]; //current board
  const cellIsEmpty = (i: number, j: number) => board[i][j]?.color === null;
  const piece = board[i][j].piece;
  const cellIsEnemy = (i: number, j: number) =>
    board[i][j]?.color && board[i][j]?.color !== color;

  if (cellIsEmpty(i, j)) {
    return moves;
  }

  //up
  if (i - 1 >= 0 && j - 2 >= 0) {
    if (cellIsEmpty(i - 1, j - 2) || cellIsEnemy(i - 1, j - 2)) {
      moves.push({ i: i - 1, j: j - 2 });
    }
  }

  if (i - 2 >= 0 && j - 1 >= 0) {
    if (cellIsEmpty(i - 2, j - 1) || cellIsEnemy(i - 2, j - 1)) {
      moves.push({ i: i - 2, j: j - 1 });
    }
  }

  if (i - 2 >= 0 && j + 1 < 8) {
    if (cellIsEmpty(i - 2, j + 1) || cellIsEnemy(i - 2, j + 1)) {
      moves.push({ i: i - 2, j: j + 1 });
    }
  }

  if (i - 1 >= 0 && j + 2 < 8) {
    if (cellIsEmpty(i - 1, j + 2) || cellIsEnemy(i - 1, j + 2)) {
      moves.push({ i: i - 1, j: j + 2 });
    }
  }

  if (i + 1 < 8 && j + 2 < 8) {
    if (cellIsEmpty(i + 1, j + 2) || cellIsEnemy(i + 1, j + 2)) {
      moves.push({ i: i + 1, j: j + 2 });
    }
  }

  if (i + 2 < 8 && j + 1 < 8) {
    if (cellIsEmpty(i + 2, j + 1) || cellIsEnemy(i + 2, j + 1)) {
      moves.push({ i: i + 2, j: j + 1 });
    }
  }

  if (i + 2 < 8 && j - 1 >= 0) {
    if (cellIsEmpty(i + 2, j - 1) || cellIsEnemy(i + 2, j - 1)) {
      moves.push({ i: i + 2, j: j - 1 });
    }
  }

  if (i + 1 < 8 && j - 2 >= 0) {
    if (cellIsEmpty(i + 1, j - 2) || cellIsEnemy(i + 1, j - 2)) {
      moves.push({ i: i + 1, j: j - 2 });
    }
  }

  return moves;
};

export const bishopMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  const { i, j } = cell;
  const moves: { i: number; j: number }[] = []; //array of possible moves
  const { color } = game[game.length - 1][i][j]; //current color
  const board = game[game.length - 1]; //current board
  const cellIsEmpty = (i: number, j: number) => board[i][j]?.color === null;
  const cellIsEnemy = (i: number, j: number) =>
    board[i][j]?.color && board[i][j]?.color !== color;

  if (cellIsEmpty(i, j)) {
    return moves;
  }

  //up-left
  for (let k = 1; i - k >= 0 && j - k >= 0; k++) {
    if (cellIsEmpty(i - k, j - k)) {
      moves.push({ i: i - k, j: j - k });
    } else if (cellIsEnemy(i - k, j - k)) {
      moves.push({ i: i - k, j: j - k });
      break;
    } else {
      break;
    }
  }

  //up-right
  for (let k = 1; i - k >= 0 && j + k < 8; k++) {
    if (cellIsEmpty(i - k, j + k)) {
      moves.push({ i: i - k, j: j + k });
    } else if (cellIsEnemy(i - k, j + k)) {
      moves.push({ i: i - k, j: j + k });
      break;
    } else {
      break;
    }
  }

  //down-left
  for (let k = 1; i + k < 8 && j - k >= 0; k++) {
    if (cellIsEmpty(i + k, j - k)) {
      moves.push({ i: i + k, j: j - k });
    } else if (cellIsEnemy(i + k, j - k)) {
      moves.push({ i: i + k, j: j - k });
      break;
    } else {
      break;
    }
  }

  //down-right
  for (let k = 1; i + k < 8 && j + k < 8; k++) {
    if (cellIsEmpty(i + k, j + k)) {
      moves.push({ i: i + k, j: j + k });
    } else if (cellIsEnemy(i + k, j + k)) {
      moves.push({ i: i + k, j: j + k });
      break;
    } else {
      break;
    }
  }

  return moves;
};

export const queenMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  return [...rookMoves(game, cell), ...bishopMoves(game, cell)];
};

export const kingMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  const { i, j } = cell;
  const moves: { i: number; j: number }[] = []; //array of possible moves
  const { color } = game[game.length - 1][i][j]; //current color
  const board = game[game.length - 1]; //current board
  const cellIsEmpty = (i: number, j: number) => board[i][j]?.color === null;
  const cellIsEnemy = (i: number, j: number) =>
    board[i][j]?.color && board[i][j]?.color !== color;

  if (cellIsEmpty(i, j)) {
    return moves;
  }

  //up
  if (i - 1 >= 0) {
    if (cellIsEmpty(i - 1, j) || cellIsEnemy(i - 1, j)) {
      moves.push({ i: i - 1, j });
    }
  }

  //down
  if (i + 1 < 8) {
    if (cellIsEmpty(i + 1, j) || cellIsEnemy(i + 1, j)) {
      moves.push({ i: i + 1, j });
    }
  }

  //left
  if (j - 1 >= 0) {
    if (cellIsEmpty(i, j - 1) || cellIsEnemy(i, j - 1)) {
      moves.push({ i, j: j - 1 });
    }
  }

  //right
  if (j + 1 < 8) {
    if (cellIsEmpty(i, j + 1) || cellIsEnemy(i, j + 1)) {
      moves.push({ i, j: j + 1 });
    }
  }

  //up-left
  if (i - 1 >= 0 && j - 1 >= 0) {
    if (cellIsEmpty(i - 1, j - 1) || cellIsEnemy(i - 1, j - 1)) {
      moves.push({ i: i - 1, j: j - 1 });
    }
  }

  //up-right
  if (i - 1 >= 0 && j + 1 < 8)
    if (cellIsEmpty(i - 1, j + 1) || cellIsEnemy(i - 1, j + 1)) {
      moves.push({ i: i - 1, j: j + 1 });
    }

  //down-left
  if (i + 1 < 8 && j - 1 >= 0) {
    if (cellIsEmpty(i + 1, j - 1) || cellIsEnemy(i + 1, j - 1)) {
      moves.push({ i: i + 1, j: j - 1 });
    }
  }

  //down-right
  if (i + 1 < 8 && j + 1 < 8) {
    if (cellIsEmpty(i + 1, j + 1) || cellIsEnemy(i + 1, j + 1)) {
      moves.push({ i: i + 1, j: j + 1 });
    }
  }

  //castling

  if (
    !board[i][j].pieceMoved &&
    !board[i][0].pieceMoved &&
    board[i][1].piece === null &&
    board[i][2].piece === null &&
    board[i][3].piece === null
  ) {
    moves.push({ i, j: j - 2 });
  }

  if (
    !board[i][j].pieceMoved &&
    !board[i][7].pieceMoved &&
    board[i][5].piece === null &&
    board[i][6].piece === null
  ) {
    moves.push({ i, j: j + 2 });
  }

  return moves;
};

export const getLegalMoves = (
  game: BoardType[],
  cell: { i: number; j: number }
) => {
  const { i, j } = cell;
  const piece = game[game.length - 1][i][j].piece;
  switch (piece) {
    case 'pawn':
      return pawnMoves(game, cell);
    case 'bishop':
      return bishopMoves(game, cell);
    case 'king':
      return kingMoves(game, cell);
    case 'knight':
      return knightMoves(game, cell);
    case 'queen':
      return queenMoves(game, cell);
    case 'rook':
      return rookMoves(game, cell);
    default:
      return [];
  }
};
