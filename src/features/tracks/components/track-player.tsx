"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    ArrowLeftIcon,
    FolderIcon,
    FullscreenIcon,
    GaugeIcon,
    LoaderCircleIcon,
    MinimizeIcon,
    PauseIcon,
    PlayIcon,
    SkipForwardIcon,
    Volume1Icon,
    Volume2Icon,
    VolumeIcon,
    VolumeOffIcon
} from "lucide-react";

import {
    cn,
    formatSeconds,
    formatSecondsTwo,
    isNumber
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

import {
    MiniEpisode,
    PopulatedSeason,
    TrackDetails,
    TrackType
} from "../types";
import { useSaveWatchTime } from "../api/use-save-watch-time";

const speeds = [
    0.5,
    0.75,
    1,
    1.25,
    1.5
]

type Speed = typeof speeds[number];

interface Props {
    type: TrackType;
    data: TrackDetails;
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

    const [isLoaded, setIsLoaded] = useState(false);

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

    const onLoadedMetadata = ({ currentTarget }: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        const fullTime = currentTarget.duration ?? 0;

        setFullTime(fullTime);
        setIsLoaded(true);

        if (typeof startTime === "number") {
            const difference = fullTime - startTime;
            const isEnding = difference < 5;

            if (isEnding) {
                if (data.nextEpisode) {
                    router.push(`/watch/${data.track.id}?episode_id=${data.nextEpisode.id}`);
                } else {
                    currentTarget.currentTime = 0;
                    setCurrentTime(0);
                }
            } else {
                currentTarget.currentTime = startTime;
                setCurrentTime(startTime);
            }

        }

        // * The autoplay feature is blocked by most popular browsers due to security reasons. Only popular websites like YouTube or Netflix can autoplay with volume, and only after the user has interacted with the website.
    }

    const playEpisode = (episode: MiniEpisode) => {
        window.location.assign(`/watch/${data.track.id}?episode_id=${episode.id}`);
    }

    useEffect(() => {
        if (videoRef.current) {
            const interval = setInterval(() => {
                setCurrentTime(videoRef.current?.currentTime ?? 0);
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

    const saveCurrentWatchTime = useCallback((useBeacon = false) => {
        if (videoRef.current) {
            const currentTime = videoRef.current.currentTime;
    
            if (useBeacon) {
                navigator.sendBeacon(
                    `/api/tracks/${data.track.id}/watch-time`,
                    JSON.stringify({ time: currentTime, episodeId: data.currentEpisode?.id })
                );
            } else {
                saveWatchTime(currentTime);
            }
        }
    }, [data.track.id, data.currentEpisode?.id, videoRef, saveWatchTime]);
    
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveCurrentWatchTime(true);
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [saveCurrentWatchTime]);

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
            {!isLoaded && (
                <div className="w-screen h-screen grid place-items-center fixed top-0 left-0 bg-background/75 backdrop-blur-2xl z-[100]">
                    <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
                </div>
            )}
            <div
                className={cn("fixed z-50 top-0 left-0 w-screen h-screen transition-opacity duration-1000 bg-cover bg-no-repeat bg-center", !isEnded && "opacity-0 scale-0")}
                style={{
                    backgroundImage: `url(${data.track.poster})`
                }}
            >
                <div className="flex flex-col items-center justify-center w-full h-full bg-black/85">
                    <img
                        src={data.track.logo}
                        alt={data.track.title}
                        width={214}
                        height={54}
                    />
                    <h1 className="mt-8 text-2xl font-bold drops">
                        Video Ended
                    </h1>
                    <div className="flex gap-3 mt-6">
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
                    className="object-cover w-screen h-screen"
                    controls={false}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={onEnded}
                    onLoadedMetadata={onLoadedMetadata}
                />
                <div
                    className={cn("w-screen h-screen fixed top-0 left-0 z-10 bg-black/80 transition-opacity", !isPauseOverlay && "opacity-0")}
                >
                    <div className="flex flex-col justify-center w-full h-full p-4 mx-auto max-w-screen-2xl">
                        <p className="text-sm font-medium text-muted-foreground">You&apos;re watching</p>
                        <h2 className={cn("text-2xl font-semibold mt-1.5", isSerie && "text-lg")}>
                            {data.track.title}
                        </h2>
                        {isSerie && (
                            <h2 className="mt-1 text-2xl font-semibold">
                                {data.currentEpisode?.title}
                            </h2>
                        )}
                        <div className="flex items-center mt-2 gap-x-4">
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
                <div className="fixed top-0 left-0 z-20 w-screen h-screen" onClick={tooglePlay}>
                </div>
                {!isEnded && (
                    <div className={cn("fixed flex flex-col gap-4 bottom-0 mb-12 px-8 w-full transition-opacity z-50", !isOverlayed && "opacity-0 scale-0")}>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="fixed top-12 left-8"
                            onClick={() => router.push("/")}
                        >
                            <ArrowLeftIcon className="size-4" />
                        </Button>
                        <div className="flex items-center w-full gap-4">
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
                            <p className="text-sm font-semibold select-none drop-shadow-md shrink-0">
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
                                        <h4 className="text-sm font-medium">Volume <span className="font-bold text-red-500">({volume.toLocaleString("en-US")}%)</span></h4>
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
                            <h4 className="flex items-center gap-1 font-medium select-none drop-shadow-md">
                                {data.track.title}
                                {isSerie && (
                                    <p className="text-neutral-300">
                                        {data.currentEpisode?.title}
                                    </p>
                                )}
                            </h4>
                            <div className="flex items-center gap-3">
                                {(seasons || nextEpisode) && (
                                    <div className="flex items-center gap-3 mr-3">
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
                                                    <h3 className="text-sm font-semibold">Seasons & Episodes</h3>
                                                    <Accordion type="single" collapsible>
                                                        {seasons.map((season, key) => (
                                                            <AccordionItem value={`season-${key}`} key={key}>
                                                                <AccordionTrigger>{season.title}</AccordionTrigger>
                                                                <AccordionContent>
                                                                    {season.episodes.map((episode) => (
                                                                        <button
                                                                            key={episode.id}
                                                                            onClick={() => playEpisode(episode)}
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
                                                                        </button>
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
                                        <h3 className="text-sm font-semibold">Playback speed</h3>
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