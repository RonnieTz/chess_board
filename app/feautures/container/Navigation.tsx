'use client';

import styles from './navigation.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { navigate, rotateBoard } from '@/app/redux/gameSlice';
const { bar, button, rotateButton } = styles;

const Navigation = () => {
  const dispatch = useDispatch();
  const { page, session } = useSelector((state: RootState) => state.game);
  const previous = () => {
    if (page === 0) return;
    dispatch(navigate(page - 1));
  };

  const next = () => {
    if (page === session.game.length - 1) return;
    dispatch(navigate(page + 1));
  };

  return (
    <div className={bar}>
      <button disabled={page === 0} onClick={previous} className={button}>
        {'<<'}
      </button>
      <button
        onClick={() => dispatch(rotateBoard())}
        className={`${button} ${rotateButton}`}
      >
        Rotate
      </button>
      <button
        disabled={page === session.game.length - 1}
        onClick={next}
        className={button}
      >
        {'>>'}
      </button>
    </div>
  );
};
export default Navigation;
