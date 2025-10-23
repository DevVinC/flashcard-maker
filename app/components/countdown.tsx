"use client";
import { useEffect, useRef } from "react";

interface CountdownProps {
  seconds: number;
  onComplete?: () => void;
}

export default function Countdown({ seconds, onComplete }: CountdownProps) {
  const numberRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(seconds); // persist current value safely

  useEffect(() => {
    if (!numberRef.current) return;

    // Function to update the displayed number
    const updateNumber = (num: string) => {
      if (!numberRef.current) return;
      numberRef.current.textContent = num;
      numberRef.current.classList.remove("animate-pop");
      void numberRef.current.offsetWidth; // force reflow
      numberRef.current.classList.add("animate-pop");
    };

    updateNumber(String(currentRef.current)); // initial number

    const interval = setInterval(() => {
      currentRef.current -= 1;

      if (currentRef.current <= 0) {
        clearInterval(interval);
        updateNumber("Go!");

        // Fade out overlay after Go! animation
        setTimeout(() => {
          if (overlayRef.current) {
            overlayRef.current.classList.add("fade-out");
          }

          // Complete callback after fade
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
        }, 700);
      } else {
        updateNumber(String(currentRef.current));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 transition-opacity duration-500"
    >
      <div
        ref={numberRef}
        className="text-8xl font-extrabold text-white drop-shadow-lg animate-pop select-none"
      >
        {seconds}
      </div>

      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          40% {
            transform: scale(1.3);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .animate-pop {
          animation: pop 0.9s ease-in-out forwards;
        }

        .fade-out {
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
