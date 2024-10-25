"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn, formatSeconds, formatSecondsTwo, isNumber } from "@/lib/utils";
import { ArrowLeftIcon, FullscreenIcon, GaugeIcon, MinimizeIcon, PauseIcon, PlayIcon, Volume, Volume1Icon, Volume2Icon, VolumeIcon, VolumeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const speeds = [
    0.5,
    0.75,
    1,
    1.25,
    1.5
]

type Speed = typeof speeds[number];

export const VideoPlayer = () => {
    const router = useRouter();

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isOverlayed, setIsOverlayed] = useState(false);
    const [isPauseOverlay, setIsPauseOverlay] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [fullTime, setFullTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<Speed>(1);
    const [volume, setVolume] = useState(100);

    const [isVolumePopoverOpen, setIsVolumePopoverOpen] = useState(false);
    const [isPlaybackSpeedPopoverOpen, setIsPlaybackSpeedPopoverOpen] = useState(false);

    const onTimeChange = (seconds: number) => {
        if (videoRef.current) {
            setCurrentTime(seconds);
            videoRef.current.currentTime = seconds;
        }
    }

    const tooglePlay = () => {
        if (videoRef.current) {            
            setIsPlaying((prev) => {
                const newValue = !prev;
    
                if (newValue) {
                    videoRef.current?.play();
                } else {
                    videoRef.current?.pause();
                }
    
                return newValue;
            })
        }
    }

    const toogleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }

    const changePlaybackSpeed = (speed: Speed) => {
        if (videoRef.current) {
            setPlaybackSpeed(speed);
            videoRef.current.playbackRate = speed;
            localStorage.setItem("playback-speed", speed.toLocaleString());
        }
    }

    const changeVolume = (volume: number) => {
        if (videoRef.current) {
            setVolume(volume);
            videoRef.current.volume = volume / 100;
            localStorage.setItem("volume", volume.toString());
        }
    }
    
    useEffect(() => {
        if (videoRef.current) {
            const interval = setInterval(() => setCurrentTime((prev) => videoRef.current?.currentTime ?? prev), 1000);

            setFullTime(videoRef.current.duration);

            return () => {
                clearInterval(interval);
            }
        }
    }, [videoRef]);

    useEffect(() => {
        const onMouseMove = () => {
            setIsOverlayed(true);
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === " ") tooglePlay();
            onMouseMove();
        }

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("click", onMouseMove);
        
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("click", onMouseMove);
        };
    }, [videoRef]);

    useEffect(() => {
        const storedVolume = Number(localStorage.getItem("volume") ?? 100);
        if (isNumber(storedVolume)) {
            changeVolume(storedVolume);
        }

        const storedPlaybackSpeed = Number(localStorage.getItem("playback-speed") ?? 1);
        if (isNumber(storedPlaybackSpeed) && speeds.includes(storedPlaybackSpeed)) {
            changePlaybackSpeed(storedPlaybackSpeed);
        }
    }, [videoRef]);

    useEffect(() => {
        if (isOverlayed) {
            setIsPauseOverlay(false);
            document.body.style.cursor = "default";
            
            const timemout = setTimeout(() => {
                setIsOverlayed(isVolumePopoverOpen || isPlaybackSpeedPopoverOpen);
            }, 3000);
            
            return () => clearTimeout(timemout);
        } else {
            document.body.style.cursor = "none";
            setIsVolumePopoverOpen(false);
            setIsPlaybackSpeedPopoverOpen(false);
        }
    }, [isOverlayed, isVolumePopoverOpen, isPlaybackSpeedPopoverOpen]);

    useEffect(() => {
        if (!isPlaying) {
            const timemout = setTimeout(() => {
                setIsPauseOverlay(true);
            }, 8000);

            return () => clearTimeout(timemout);
        }
    }, [isPlaying]);

    return (
        <div
            ref={containerRef}
        >
            <video
                ref={videoRef}
                src="/series-and-movies/videos/fast-and-furious-9.webm"
                className="w-screen h-screen object-cover"
                controls={false}
            />
            <div
                className={cn("w-screen h-screen fixed top-0 left-0 z-10 bg-black/50 transition-opacity", !isPauseOverlay && "opacity-0")}
            >
                <div className="w-full max-w-screen-2xl mx-auto p-4 flex flex-col justify-center h-full">
                    <p className="text-sm font-medium text-muted-foreground">You&apos;re watching</p>
                    <h2 className="text-2xl font-semibold mt-1.5">
                        Fast and Furious 9
                    </h2>
                    <div className="flex items-center gap-x-4 mt-2">
                        <span className="font-semibold">
                            2024
                        </span>
                        <span className="font-semibold">
                            18+
                        </span>
                        <span className="font-semibold">
                            {formatSeconds(fullTime)}
                        </span>
                    </div>
                    <p className="text-xs mt-3 sm:max-w-[400px] text-muted-foreground leading-5">
                        Fast & Furious 9 follows Dom Toretto (Vin Diesel) as he faces his vengeful brother Jakob (John Cena) in a high-stakes, globe-trotting adventure. Packed with wild stunts and fast-paced action, the movie explores family loyalty and old rivalries in classic Fast & Furious style.
                    </p>
                </div>
                <p className="absolute bottom-0 right-0 m-20 text-sm font-semibold text-muted-foreground">
                    Paused
                </p>
            </div>
            <div className="fixed w-screen h-screen top-0 left-0 z-20" onClick={tooglePlay}>
            </div>
            <div className={cn("fixed flex flex-col gap-4 bottom-0 mb-12 px-8 w-full transition-opacity z-50", !isOverlayed && "opacity-0 scale-0")}>
                <Button
                    size="icon"
                    variant="ghost"
                    className="fixed top-12 left-8"
                    onClick={router.back}
                >
                    <ArrowLeftIcon className="size-4" />
                </Button>
                <div className="flex items-center gap-4 w-full">
                    <Slider className="flex-grow" value={[currentTime]} min={0} max={fullTime} onValueChange={(values) => onTimeChange(values[0])} disabled={!videoRef.current} />
                    <p className="text-sm font-semibold drop-shadow-md shrink-0 select-none">
                        {formatSecondsTwo(fullTime - currentTime)}
                    </p>
                </div>
                <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={tooglePlay}
                            >
                            {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
                        </button>
                        <Popover
                            open={isVolumePopoverOpen}
                            defaultOpen={isVolumePopoverOpen}
                            onOpenChange={setIsVolumePopoverOpen}
                        >
                            <PopoverTrigger>
                                {volume === 0 && <VolumeOffIcon className="size-5" />}
                                {volume > 0 && volume < 10 && <VolumeIcon className="size-5" /> }
                                {volume >= 10 && volume < 50 && <Volume1Icon className="size-5" /> }
                                {volume > 50 && <Volume2Icon className="size-5" /> }
                            </PopoverTrigger>
                            <PopoverContent align="start" sideOffset={10}>
                                <h4 className="font-medium text-sm">Volume <span className="text-red-500 font-bold">({volume.toLocaleString("en-US")}%)</span></h4>
                                <Slider
                                    value={[volume]}
                                    min={0}
                                    max={100}
                                    onValueChange={(values) => changeVolume(values[0])}
                                    className="mt-2"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <h4 className="font-medium select-none">
                        Fast and Furious 9
                    </h4>
                    <div className="flex items-center gap-3">
                        <Popover
                            open={isPlaybackSpeedPopoverOpen}
                            defaultOpen={isPlaybackSpeedPopoverOpen}
                            onOpenChange={setIsPlaybackSpeedPopoverOpen}
                        >
                            <PopoverTrigger>
                                <GaugeIcon className="size-5" />
                            </PopoverTrigger>
                            <PopoverContent align="end" sideOffset={10}>
                                <h3 className="font-semibold text-sm">Playback speed</h3>
                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                    {speeds.map((speed) => (
                                        <Button
                                            key={speed}
                                            variant={speed === playbackSpeed ? "foreground" : "outline"}
                                            size="sm"
                                            onClick={() => changePlaybackSpeed(speed)}
                                        >
                                            x{speed.toLocaleString("en-US", { minimumFractionDigits: 1 })}
                                        </Button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <button
                            onClick={toogleFullscreen}
                        >
                            {isFullscreen ? <MinimizeIcon className="size-5" /> : <FullscreenIcon className="size-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}