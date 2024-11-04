"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn, formatSeconds, formatSecondsTwo, isNumber } from "@/lib/utils";
import { ArrowLeftIcon, FolderIcon, FullscreenIcon, GaugeIcon, MinimizeIcon, PauseIcon, PlayIcon, SkipForwardIcon, Volume, Volume1Icon, Volume2Icon, VolumeIcon, VolumeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Episode, MiniEpisode, PopulatedSeason, Track, TrackType } from "../types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSaveWatchTime } from "../api/use-save-watch-time";
import Link from "next/link";
import Image from "next/image";

const speeds = [
    0.5,
    0.75,
    1,
    1.25,
    1.5
]

type Speed = typeof speeds[number];

interface Data {
    track: Track;
    currentEpisode?: Episode;
    nextEpisode?: MiniEpisode;
}

interface Props {
    type: TrackType;
    data: Data;
    seasons?: PopulatedSeason[];
    nextEpisode?: MiniEpisode | null;
    videoSrc: string;
    time?: number;
}

export const TrackPlayer = ({
    type,
    data,
    seasons,
    nextEpisode,
    videoSrc,
    time: startTime
}: Props) => {
    const isSerie = !!(type === TrackType.SERIE && data.currentEpisode);

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
    const [isNextEpisodeTooltipOpen, setIsNextEpisodeTooltipOpen] = useState(false);
    const [isSeasonsPopoverOpen, setIsSeasonsPopoverOpen] = useState(false);

    const isAnyOpen = useMemo(() => isVolumePopoverOpen || isPlaybackSpeedPopoverOpen || isNextEpisodeTooltipOpen || isSeasonsPopoverOpen, [isVolumePopoverOpen, isPlaybackSpeedPopoverOpen, isNextEpisodeTooltipOpen, isSeasonsPopoverOpen]);

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
            const onLoad = () => {
                setFullTime(videoRef.current?.duration ?? 0);
            }

            videoRef.current.addEventListener("loadedmetadata", onLoad);
            
            return () => {
                videoRef.current?.removeEventListener("load", onLoad);
            }
        }
    }, [videoRef]);

    useEffect(() => {
        if (videoRef.current) {
            const interval = setInterval(() => {
                setCurrentTime(videoRef.current?.currentTime ?? 0);
                if (videoRef.current) {
                    // videoRef.current.currentTime = 50;
                }
            }, 1000);
    
            return () => clearInterval(interval);
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
                setIsOverlayed(isAnyOpen);
            }, 3000);
            
            return () => clearTimeout(timemout);
        } else {
            document.body.style.cursor = "none";
            setIsVolumePopoverOpen(false);
            setIsPlaybackSpeedPopoverOpen(false);
        }
    }, [isOverlayed, isAnyOpen]);

    useEffect(() => {
        if (!isPlaying) {
            const timemout = setTimeout(() => {
                setIsPauseOverlay(true);
            }, 8000);

            return () => clearTimeout(timemout);
        }
    }, [isPlaying]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const eKeyNum = Number(e.key);

            if (isNumber(eKeyNum) && e.key !== " ") {
                onTimeChange(fullTime * (eKeyNum / 10));
            }

            if (e.key === "f") {
                toogleFullscreen();
            }
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [fullTime]);

    const { mutate: saveWatchTime } = useSaveWatchTime({ trackId: data.track.id, episodeId: data.currentEpisode?.id });

    useEffect(() => {
        if (videoRef.current && startTime) {
            const difference = Math.abs(fullTime - startTime);

            const isCloseToEnd = difference <= 5;

            onTimeChange(isCloseToEnd ? 0 : startTime);
        }
    }, [videoRef, startTime, fullTime, nextEpisode]);

    const saveCurrentWatchTime = (useBeacon?: boolean) => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;

            if (useBeacon) {
                navigator.sendBeacon(`/api/tracks/${data.track.id}/watch-time`, JSON.stringify({ time: currentTime, episodeId: data.currentEpisode?.id }))
            } else {
                saveWatchTime(currentTime);
            }
        }
    }

    useEffect(() => {
        const handleBeforeUnload = () => {
            saveCurrentWatchTime(true);
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [videoRef]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.muted = false;
            }
        }, 900);

        return () => clearTimeout(timeout);
    }, [videoRef]);    

    const [isEnded, setIsEnded] = useState(false);

    const onEnded = () => {
        setIsEnded(true);

        if (isPlaying) {
            tooglePlay();
        }

        if (isFullscreen) {
            toogleFullscreen();
        }
    }

    const onWatchAgain = () => {
        setIsEnded(false);
        onTimeChange(0);
        tooglePlay();
    }

    return (
        <div className="relative">
            <div
                className={cn("fixed z-50 top-0 left-0 w-screen h-screen transition-opacity duration-1000 bg-cover bg-no-repeat bg-center", !isEnded && "opacity-0 scale-0")}
                style={{
                    backgroundImage: `url(${data.track.poster})`
                }}
            >
                <div className="w-full h-full bg-black/85 flex flex-col items-center justify-center">
                    <Image
                        src={data.track.logo}
                        alt={data.track.title}
                        width={214}
                        height={54}
                    />
                    <h1 className="mt-8 text-2xl font-bold drops">
                        Video Ended
                    </h1>
                    <div className="mt-6 flex gap-3">
                        <Button
                            size="lg"
                            onClick={onWatchAgain}
                        >
                            Watch again
                        </Button>
                        <Button
                            size="lg"
                        >
                            {(isSerie && nextEpisode) ? (
                                <Link href={`/watch/${data.track.id}?episode_id=${nextEpisode.id}`}>
                                    Watch next episode
                                </Link>
                            ): (
                                <Link href="/">
                                    Back to home
                                </Link>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <div
                ref={containerRef}
                className={cn("transition-opacity duration-1000", isEnded && "opacity-0 scale-0")}
            >
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-screen h-screen object-cover"
                    controls={false}
                    autoPlay
                    muted
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={onEnded}
                />
                <div
                    className={cn("w-screen h-screen fixed top-0 left-0 z-10 bg-black/80 transition-opacity", !isPauseOverlay && "opacity-0")}
                >
                    <div className="w-full max-w-screen-2xl mx-auto p-4 flex flex-col justify-center h-full">
                        <p className="text-sm font-medium text-muted-foreground">You&apos;re watching</p>
                        <h2 className={cn("text-2xl font-semibold mt-1.5", isSerie && "text-lg")}>
                            {data.track.title}
                        </h2>
                        {isSerie && (
                            <h2 className="text-2xl font-semibold mt-1">
                                {data.currentEpisode?.title}
                            </h2>
                        )}
                        <div className="flex items-center gap-x-4 mt-2">
                            <span className="font-semibold">
                                {data.track.year}
                            </span>
                            <span className="font-semibold">
                                {data.track.ageLimit}
                            </span>
                            <span className="font-semibold">
                                {formatSeconds(fullTime)}
                            </span>
                        </div>
                        <p className="text-xs mt-3 sm:max-w-[400px] text-muted-foreground leading-5">
                            {isSerie ? data.currentEpisode?.description : data.track.description}
                        </p>
                    </div>
                    <p className="absolute bottom-0 right-0 m-20 text-sm font-semibold text-muted-foreground">
                        Paused
                    </p>
                </div>
                <div className="fixed w-screen h-screen top-0 left-0 z-20" onClick={tooglePlay}>
                </div>
                {!isEnded && (
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
                            <Slider
                                className="flex-grow"
                                value={[currentTime]}
                                min={0} max={fullTime}
                                onValueChange={(values) => {
                                    setCurrentTime(values[0]);
                                    onTimeChange(values[0]);
                                }}
                                disabled={!videoRef.current}
                            />
                            <p className="text-sm font-semibold drop-shadow-md shrink-0 select-none">
                                {formatSecondsTwo(fullTime - currentTime)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between w-full gap-3">
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={tooglePlay}
                                    variant="pop"
                                    size="zero"
                                >
                                    {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
                                </Button>
                                <Popover
                                    open={isVolumePopoverOpen}
                                    defaultOpen={isVolumePopoverOpen}
                                    onOpenChange={setIsVolumePopoverOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="pop"
                                            size="zero"
                                        >
                                            {volume === 0 && <VolumeOffIcon className="size-5" />}
                                            {volume > 0 && volume < 10 && <VolumeIcon className="size-5" /> }
                                            {volume >= 10 && volume < 50 && <Volume1Icon className="size-5" /> }
                                            {volume > 50 && <Volume2Icon className="size-5" /> }
                                        </Button>
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
                            <h4 className="font-medium select-none flex items-center gap-1 drop-shadow-md">
                                {data.track.title}
                                {isSerie && (
                                    <p className="text-neutral-300">
                                        {data.currentEpisode?.title}
                                    </p>
                                )}
                            </h4>
                            <div className="flex items-center gap-3">
                                {(seasons || nextEpisode) && (
                                    <div className="mr-3 flex items-center gap-3">
                                        {nextEpisode && (
                                            <TooltipProvider>
                                                <Tooltip
                                                    defaultOpen={isNextEpisodeTooltipOpen}
                                                    open={isNextEpisodeTooltipOpen}
                                                    onOpenChange={setIsNextEpisodeTooltipOpen}
                                                >
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="pop"
                                                            size="zero"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/watch/${data.track.id}?episode_id=${nextEpisode.id}`}
                                                            >
                                                                <SkipForwardIcon className="size-5" />
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Next Episode: {nextEpisode.title}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {seasons && (
                                            <Popover
                                                defaultOpen={isSeasonsPopoverOpen}
                                                open={isSeasonsPopoverOpen}
                                                onOpenChange={setIsSeasonsPopoverOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="pop"
                                                        size="zero"
                                                    >
                                                        <FolderIcon className="size-5" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    align="end"
                                                    sideOffset={10}
                                                    className="w-[360px]"
                                                >
                                                    <h3 className="font-semibold text-sm">Seasons & Episodes</h3>
                                                    <Accordion type="single" collapsible>
                                                        {seasons.map((season, key) => (
                                                            <AccordionItem value={`season-${key}`} key={key}>
                                                                <AccordionTrigger>{season.title}</AccordionTrigger>
                                                                <AccordionContent>
                                                                    {season.episodes.map((episode) => (
                                                                        <Link
                                                                            href={`/watch/${data.track.id}?episode_id=${episode.id}`}
                                                                            className={cn("text-xs font-medium text-neutral-200 p-2.5 rounded-md transition hover:bg-neutral-900 w-full flex justify-between hover:text-white", episode.id === data.currentEpisode?.id && "pointer-events-none text-white bg-neutral-900")}
                                                                        >
                                                                            <p>
                                                                                {episode.title}
                                                                            </p>
                                                                            {episode.id === data.currentEpisode?.id && (
                                                                                <p className="text-[10px] font-medium text-muted-foreground">
                                                                                    Currently Watching
                                                                                </p>
                                                                            )}
                                                                        </Link>
                                                                    ))}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ))}
                                                    </Accordion>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                )}
                                <Popover
                                    open={isPlaybackSpeedPopoverOpen}
                                    defaultOpen={isPlaybackSpeedPopoverOpen}
                                    onOpenChange={setIsPlaybackSpeedPopoverOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="pop"
                                            size="zero"
                                        >
                                            <GaugeIcon className="size-5" />
                                        </Button>
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
                                <Button
                                    onClick={toogleFullscreen}
                                    variant="pop"
                                    size="zero"
                                >
                                    {isFullscreen ? <MinimizeIcon className="size-5" /> : <FullscreenIcon className="size-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}