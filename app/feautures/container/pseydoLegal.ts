import {
  pawnMoves,
  bishopMoves,
  kingMoves,
  knightMoves,
  queenMoves,
  rookMoves,
} from './legalMoves';
import { Board } from './boardSetup';

type GameType = ReturnType<typeof Board>[];

const getLegalMoves = (game: GameType, cell: { i: number; j: number }) => {
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

export const pseydoLegalMoves = (game: GameType, color: string) => {
  const moves: { i: number; j: number }[] = [];
  game[game.length - 1].forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.color === color) {
        moves.push(...getLegalMoves(game, { i, j }));
      }
    });
  });
  return moves;
};
