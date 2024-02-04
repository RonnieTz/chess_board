import { BoardType, getLegalMoves } from './legalMoves';
import { pseydoLegalMoves } from './pseydoLegal';
import { cloneDeepWith } from 'lodash';

function Box(
  piece: string | null,
  color: string | null,
  indexRow?: string,
  indexCol?: number
): {
  piece: string | null;
  pieceMoved: boolean;
  selected: boolean;
  color: string | null;
  legalMoves: { i: number; j: number }[];
  indexRow?: string | undefined;
  indexCol?: number | undefined;
} {
  return {
    piece: piece,
    pieceMoved: false,
    selected: false,
    color: color,
    legalMoves: [],
    indexRow: indexRow,
    indexCol: indexCol,
  };
}

export function Board(): ReturnType<typeof Box>[][] {
  return [
    [
      Box('rook', 'black', 'A', 8),
      Box('knight', 'black', 'B'),
      Box('bishop', 'black', 'C'),
      Box('queen', 'black', 'D'),
      Box('king', 'black', 'E'),
      Box('bishop', 'black', 'F'),
      Box('knight', 'black', 'G'),
      Box('rook', 'black', 'H', 8),
    ],
    [
      Box('pawn', 'black', undefined, 7),
      Box('pawn', 'black'),
      Box('pawn', 'black'),
      Box('pawn', 'black'),
      Box('pawn', 'black'),
      Box('pawn', 'black'),
      Box('pawn', 'black'),
      Box('pawn', 'black', undefined, 7),
    ],
    [
      Box(null, null, undefined, 6),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null, undefined, 6),
    ],
    [
      Box(null, null, undefined, 5),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null, undefined, 5),
    ],
    [
      Box(null, null, undefined, 4),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null, undefined, 4),
    ],
    [
      Box(null, null, undefined, 3),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null),
      Box(null, null, undefined, 3),
    ],
    [
      Box('pawn', 'white', undefined, 2),
      Box('pawn', 'white'),
      Box('pawn', 'white'),
      Box('pawn', 'white'),
      Box('pawn', 'white'),
      Box('pawn', 'white'),
      Box('pawn', 'white'),
      Box('pawn', 'white', undefined, 2),
    ],
    [
      Box('rook', 'white', 'A', 1),
      Box('knight', 'white', 'B'),
      Box('bishop', 'white', 'C'),
      Box('queen', 'white', 'D'),
      Box('king', 'white', 'E'),
      Box('bishop', 'white', 'F'),
      Box('knight', 'white', 'G'),
      Box('rook', 'white', 'H', 1),
    ],
  ];
}

export function Game(): {
  game: ReturnType<typeof Board>[];
  turn: 'white' | 'black';
  selectedPiece: { i: number; j: number } | null;
  legalMoves: { i: number; j: number }[];
  makeMove: (
    target: { i: number; j: number },
    selected: { i: number; j: number }
  ) => void;
  nextTurn: () => void;
  selectPiece: (cell: { i: number; j: number }) => void;
  removePieceSelection: () => void;
  getLegalMoves: (
    game: BoardType[],
    cell: { i: number; j: number }
  ) => { i: number; j: number }[];
} {
  return {
    game: [Board()],
    turn: 'white',
    selectedPiece: null,
    legalMoves: [],
    makeMove: function (target: { i: number; j: number }) {
      const { i, j } = target;
      const { i: i0, j: j0 } = this.selectedPiece!;
      const gIndex = this.game.length - 1;
      const targetCell = this.game[gIndex][i][j];
      const selectedCell = this.game[gIndex][i0][j0];
      // this.game.push(this.game[gIndex]);

      //en passant
      if (
        selectedCell.piece === 'pawn' &&
        targetCell.color === null &&
        j0 !== j
      ) {
        this.game[gIndex][i0][j].color = null;
        this.game[gIndex][i0][j].piece = null;
      }

      // castling
      if (
        selectedCell.piece === 'king' &&
        selectedCell.pieceMoved === false &&
        (j === j0 + 2 || j === j0 - 2)
      ) {
        const rook =
          j === j0 + 2 ? this.game[gIndex][i0][7] : this.game[gIndex][i0][0];
        this.game[gIndex][i0][j0 + (j === j0 + 2 ? 1 : -1)].color = rook.color;
        this.game[gIndex][i0][j0 + (j === j0 + 2 ? 1 : -1)].piece = rook.piece;
        rook.color = null;
        rook.piece = null;
      }

      targetCell.color = selectedCell.color;
      targetCell.piece = selectedCell.piece;
      if (selectedCell.piece === 'pawn' && (i === 0 || i === 7)) {
        targetCell.piece = 'queen';
      }
      selectedCell.color = null;
      selectedCell.piece = null;
      selectedCell.selected = false;
      targetCell.pieceMoved = true;
      this.selectedPiece = null;
      this.legalMoves = [];
    },
    nextTurn: function () {
      this.turn = this.turn === 'white' ? 'black' : 'white';
    },
    selectPiece: function (cell: { i: number; j: number }) {
      const { i, j } = cell;
      const currentGame = this.game.length - 1; // current game index
      this.game[currentGame][i][j].selected = true; // select the piece
      this.selectedPiece = cell; // save the selected piece
      this.legalMoves = this.getLegalMoves(this.game, cell).filter((move) => {
        const from = cell;
        const to = move;
        const gameCopy = cloneDeepWith(this);
        gameCopy.makeMove(move, cell);

        const pseydoLegal = pseydoLegalMoves(
          gameCopy.game,
          this.turn === 'white' ? 'black' : 'white'
        );
        const kingChecked = pseydoLegal.some(({ i, j }) => {
          return (
            (this.game[currentGame][i][j].piece === 'king' &&
              this.game[currentGame][i][j].color === this.turn &&
              this.game[currentGame][cell.i][cell.j].piece !== 'king') ||
            (this.game[currentGame][cell.i][cell.j].piece === 'king' &&
              gameCopy.game[currentGame][i][j].color === this.turn &&
              gameCopy.game[currentGame][i][j].piece === 'king')
          );
        });

        const castlingIsBlocked =
          ((from.i === 0 || from.i === 7) &&
            from.j === 4 &&
            to.j === 6 &&
            this.game[currentGame][from.i][from.j].piece === 'king' &&
            pseydoLegal.some(({ i, j }) => {
              return i === from.i && j === 5;
            })) ||
          ((from.i === 0 || from.i === 7) &&
            from.j === 4 &&
            to.j === 2 &&
            this.game[currentGame][from.i][from.j].piece === 'king' &&
            pseydoLegal.some(({ i, j }) => {
              return i === from.i && j === 3;
            }));

        return !kingChecked && !castlingIsBlocked;
      });
    },
    removePieceSelection: function () {
      const { i, j } = this.selectedPiece!;
      this.game[this.game.length - 1][i][j].selected = false;
      this.selectedPiece = null;
      this.legalMoves = [];
    },
    getLegalMoves: getLegalMoves,
  };
}
