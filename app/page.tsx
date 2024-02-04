import GameContainer from './feautures/container/GameContainer';
import Navigation from './feautures/container/Navigation';
import styles from './page.module.css';
const { main } = styles;

export default function Home() {
  return (
    <main className={main}>
      <GameContainer />
      <Navigation />
    </main>
  );
}
