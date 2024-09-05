import { FC } from 'react';
import styles from './Eliminated.module.scss';

interface EliminatedProps {
  text?: string;
  subtext?: string;
}

const Eliminated: FC<EliminatedProps> = ({
  text = 'You are eliminated!',
  subtext,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>{text}</div>
      {subtext && <div className={styles.subtext}>{subtext}</div>}
    </div>
  );
};

export default Eliminated;
