"use client";
import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/use-confetti-store";

const ConfettiProvider = () => {
    const confetti = useConfettiStore();
    if (!confetti) return null;
    return (
        <ReactConfetti
            className="pointer-events-none z-[100]"
            numberOfPieces={500}
            recycle={false}
            run={confetti.isOpen}
            onConfettiComplete={() => confetti.onClose()}
            gravity={0.2}
            friction={0.99}
            wind={0}
            initialVelocityX={{ min: -10, max: 10 }}
            initialVelocityY={{ min: -10, max: 10 }}
            tweenDuration={4000}
            width={5366}
            height={1615}
            style={{ position: "fixed", top: 0, left: 0 }}
        />
    );
};

export default ConfettiProvider;
