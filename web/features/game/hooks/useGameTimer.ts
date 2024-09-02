import { useState, useEffect, useCallback } from 'react';

interface UseGameTimerProps {
  currentRound: number;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  isGameActive: boolean;
  setIsGameActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAttackerDone: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRunnerDone: React.Dispatch<React.SetStateAction<boolean>>;
  ROUND_DURATION: number;
  ROUND_BREAK_DURATION: number;
  TOTAL_ROUNDS: number;
}

export const useGameTimer = ({
  currentRound,
  setCurrentRound,
  isGameActive,
  setIsGameActive,
  setIsAttackerDone,
  setIsRunnerDone,
  ROUND_DURATION,
  ROUND_BREAK_DURATION,
  TOTAL_ROUNDS,
}: UseGameTimerProps) => {
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [roundEndTime, setRoundEndTime] = useState<number>(
    Date.now() + ROUND_DURATION
  );
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const startNextRound = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      const now = Date.now();
      setCurrentRound((prev) => prev + 1);
      setRoundStartTime(now + ROUND_BREAK_DURATION);
      setRoundEndTime(now + ROUND_BREAK_DURATION + ROUND_DURATION);
      setIsAttackerDone(false);
      setIsRunnerDone(false);
    } else {
      setIsGameActive(false);
      console.log('Game over!');
    }
  }, [
    currentRound,
    TOTAL_ROUNDS,
    ROUND_BREAK_DURATION,
    ROUND_DURATION,
    setCurrentRound,
    setIsGameActive,
    setIsAttackerDone,
    setIsRunnerDone,
  ]);

  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now < roundStartTime) {
        setTimeLeft(Math.ceil((roundStartTime - now) / 1000));
        setIsRoundActive(false);
      } else if (now < roundEndTime) {
        setTimeLeft(Math.ceil((roundEndTime - now) / 1000));
        setIsRoundActive(true);
      } else {
        setTimeLeft(0);
        setIsRoundActive(false);
        startNextRound();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, roundStartTime, roundEndTime, startNextRound]);

  return {
    roundStartTime,
    roundEndTime,
    isRoundActive,
    timeLeft,
    startNextRound,
  };
};
