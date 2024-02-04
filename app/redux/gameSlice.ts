'use client';

import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { stat } from 'fs';

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    nextTurn: (state) => {
      state.session.nextTurn();
    },
    selectPiece: (state, action) => {
      state.session.selectPiece(action.payload);
    },
    removePieceSelection: (state) => {
      state.session.removePieceSelection();
    },
    movePiece: (state, action) => {
      const { i, j } = state.session.selectedPiece!;
      state.session.makeMove(action.payload, state.session.selectedPiece!);
      state.session.game[state.session.game.length - 2][i][j].selected = false;
    },
    saveGame: (state) => {
      state.session.game.push(
        state.session.game[state.session.game.length - 1]
      );
    },
    rotateBoard: (state) => {
      state.rotate = !state.rotate;
    },
    navigate: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  selectPiece,
  nextTurn,
  removePieceSelection,
  movePiece,
  rotateBoard,
  navigate,
  saveGame,
} = gameSlice.actions;
export default gameSlice.reducer;
