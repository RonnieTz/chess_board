'use client';

import styles from './container.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  selectPiece,
  removePieceSelection,
  movePiece,
  nextTurn,
  navigate,
  saveGame,
} from '@/app/redux/gameSlice';
import Piece from './Piece';
const {
  container,
  box,
  line,
  dark,
  light,
  selected,
  legal,
  rowIndex,
  rowIndex_left,
  rowIndex_right,
  colIndex,
  colIndex_top,
  colIndex_bottom,
  playerName_1,
  playerName_2,
  playerTurn,
} = styles;

const GameContainer = () => {
  const dispatch = useDispatch();
  const { game, selectedPiece, turn } = useSelector(
    (state: RootState) => state.game.session
  );
  const { rotate, session, page } = useSelector(
    (state: RootState) => state.game
  );

  const legalMoves = session.legalMoves;

  const handleClick = (i: number, j: number) => {
    const targetColor = game[game.length - 1][i][j].color;
    const targetIsPiece = game[game.length - 1][i][j].piece;
    const targetIsAlly = targetColor === turn;
    const targetIsSelectedPiece =
      selectedPiece?.i === i && selectedPiece?.j === j;

    if (!selectedPiece) {
      //select piece
      if (targetIsAlly && page === game.length - 1) {
        dispatch(selectPiece({ i, j }));
      }
    }
    if (selectedPiece) {
      if (targetIsPiece) {
        if (targetIsAlly) {
          if (targetIsSelectedPiece) {
            dispatch(removePieceSelection());
          } else {
            //change selection
            dispatch(removePieceSelection());
            dispatch(selectPiece({ i, j }));
          }
        }
      }
      if (
        (!targetIsPiece || !targetIsAlly) &&
        legalMoves.some((move) => move.i === i && move.j === j)
      ) {
        //move piece
        dispatch(saveGame());
        dispatch(movePiece({ i, j }));
        dispatch(nextTurn());
        dispatch(navigate(page + 1));
        // setTimeout(() => {
        //   dispatch(rotateBoard());
        // }, 500);
      }
    }
  };
  return (
    <>
      <div className={`${container} ${rotate ? styles.rotate : null}`}>
        <h1
          className={`${playerName_2} ${
            turn === 'white' && page === session.game.length - 1 && playerTurn
          } ${rotate && styles.rotate}`}
          style={{
            transform: rotate ? 'rotate(180deg)' : undefined,
            transformOrigin: '25%',
          }}
        >
          {'White'}
        </h1>
        <h1
          className={`${playerName_1} ${
            turn === 'black' && page === session.game.length - 1 && playerTurn
          }`}
          style={{
            transform: rotate ? 'rotate(180deg)' : undefined,
            transformOrigin: '25%',
          }}
        >
          {'Black'}
        </h1>
        {game[page].map((row, i) => (
          <div className={line} key={i}>
            {row.map((square, j) => (
              <div
                onClick={() => handleClick(i, j)}
                className={`${box} ${(i + j) % 2 ? dark : light} ${
                  square.selected ? selected : null
                } ${
                  legalMoves.some((move) => move.i === i && move.j === j)
                    ? legal
                    : null
                } ${rotate ? styles.rotate : null}`}
                key={j}
              >
                <Piece piece={square.piece} color={square.color} />
                <div
                  className={`${rowIndex} ${
                    j === 0 && !rotate
                      ? rowIndex_left
                      : j === 0 && rotate
                      ? rowIndex_right
                      : j === 7 && !rotate
                      ? rowIndex_right
                      : j === 7 && rotate
                      ? rowIndex_left
                      : null
                  }`}
                >
                  {square.indexCol}
                </div>
                <div
                  className={`${colIndex} ${
                    i === 0 && !rotate
                      ? colIndex_top
                      : i === 0 && rotate
                      ? colIndex_bottom
                      : i === 7 && !rotate
                      ? colIndex_bottom
                      : i === 7 && rotate
                      ? colIndex_top
                      : null
                  }`}
                >
                  {square.indexRow}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
export default GameContainer;
