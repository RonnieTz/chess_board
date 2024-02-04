import { Game } from '../feautures/container/boardSetup';

export const initialState: {
  session: ReturnType<typeof Game>;
  rotate: boolean;
  page: number;
} = {
  session: Game(),
  rotate: false,
  page: 0,
};
