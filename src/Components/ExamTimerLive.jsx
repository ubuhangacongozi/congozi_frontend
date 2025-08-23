import React, { useEffect, useState } from "react";


const Timer = ({ initialTime, onTimeEnd, examId, examFinished }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timeEnded, setTimeEnded] = useState(false);

  useEffect(() => {
    if (examFinished || !examId) return;

    const storedTime = localStorage.getItem(`examTimeLeft_${examId}`);
    const initialTimeValue = storedTime
      ? parseInt(storedTime, 10)
      : initialTime;
    setTimeLeft(initialTimeValue);
    if (storedTime && parseInt(storedTime, 10) <= 0) {
      setTimeEnded(true);
      onTimeEnd();
    }
  }, [examId, initialTime, examFinished, onTimeEnd]);

  useEffect(() => {
    if (examFinished || !examId || timeEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        if (newTime <= 0) {
          clearInterval(timer);
          localStorage.removeItem(`examTimeLeft_${examId}`);
          setTimeEnded(true);
          onTimeEnd();
          return 0;
        }
        
        localStorage.setItem(`examTimeLeft_${examId}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished, examId, onTimeEnd, timeEnded]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};

export default Timer;