import React, { useEffect, useState, useRef } from "react";

const ExamTimer = ({ accessCode, duration = 2400, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);
  const getRemainingTime = () => {
    const startTime = parseInt(
      localStorage.getItem(`exam_${accessCode}_start`),
      10
    );
    const savedDuration = parseInt(
      localStorage.getItem(`exam_${accessCode}_duration`),
      10
    );

    if (!startTime || !savedDuration) return duration;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = savedDuration - elapsed;

    return remaining > 0 ? remaining : 0;
  };
  const startTimerIfNotStarted = () => {
    const existingStart = localStorage.getItem(`exam_${accessCode}_start`);
    if (!existingStart) {
      localStorage.setItem(`exam_${accessCode}_start`, Date.now().toString());
      localStorage.setItem(`exam_${accessCode}_duration`, duration.toString());
    }
  };

  useEffect(() => {
    startTimerIfNotStarted();
    setTimeLeft(getRemainingTime());

    intervalRef.current = setInterval(() => {
      const remaining = getRemainingTime();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        localStorage.removeItem(`exam_${accessCode}_start`);
        localStorage.removeItem(`exam_${accessCode}_duration`);
        if (onTimeout) onTimeout();
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [accessCode]);
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return <div>{formatTime(timeLeft)}</div>;
};

export default ExamTimer;
