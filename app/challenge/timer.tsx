"use client"

interface TimerProps {
    time: number
};

export default function({time}: TimerProps) {
    // ⏳ Format HH:MM:SS
    const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
    };
    
    return (
        <div className="font-mono text-base font-semibold text-gray-700 tracking-widest bg-white border border-gray-200 rounded-md px-3 py-1 shadow-sm">
            {formatTime(time)}
        </div>
    )
}