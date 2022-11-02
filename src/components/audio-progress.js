import {Card, CardContent, Stack, Typography} from "@mui/material";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import {Close, PauseOutlined, PlayArrowOutlined} from "@mui/icons-material";

const AudioProgress = ({totalSeconds, src, audio}) => {
    const [state, setState] = useState('inactive');
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);
    const audioRef = useRef(null);

    // console.log(audio);

    console.log(totalSeconds)

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.src = src;
    }, [src]);

    useEffect(() => {
        if (state === 'playing') {
            if (seconds <= totalSeconds) {
                timerRef.current = setInterval(() => {
                    setSeconds(seconds => seconds + 1);
                }, 1000);
            }
        }
        if (seconds === totalSeconds) {
            setState('inactive');
        }
        return () => {
            clearInterval(timerRef.current);
        }
    }, [seconds, state, totalSeconds]);


    const formatTime = seconds => {
        return seconds < 10 ? `0${seconds}` : seconds;
    }

    const handleCancelClick = useCallback(() => {
        setSeconds(0);
    }, []);

    const handleClickPlay = () => {
        console.log('play button clicked');
        if (state === 'paused') {
            console.log('state is paused and now playing')
            setState('playing');
            if (audioRef) {
                audioRef.current.play().then(() => {
                    console.log('playing')
                });
            }
        } else if (state === 'inactive') {
            setSeconds(0);
            setState('playing');
            if (audioRef) {
                audioRef.current.play().then(() => {
                    console.log('playing')
                })
            }
            console.log('state paused and now playing')
        } else {
            console.log('else running');
        }
    }

    const handlePauseClick = () => {
        setState('paused');
        if (audioRef) {
            audioRef.current.pause();
        }
    }

    console.log(seconds / totalSeconds * 100, 'seconds / totalSeconds * 100')

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 32,
                position: "relative",
                pt: 1,
                "&:after": {
                    content: "\"\"",
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    height: "100%",
                    width: `${parseInt(`${seconds / totalSeconds * 100}`)}%`,
                    backgroundColor: "#00B267",
                    transition: `width ${totalSeconds}ms linear`
                }
            }}>
            <CardContent>
                <Stack
                    sx={{position: "relative"}}
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    {state === 'playing' ?
                        <PauseOutlined
                            color="secondary"
                            sx={{
                                cursor: "pointer",
                                zIndex: 1000,
                                position: "absolute",
                                left: 0,
                                color: seconds / totalSeconds * 100 < 10 ? "#000000" : "#FFFFFF"
                            }}
                            onClick={handlePauseClick}/> :
                        <PlayArrowOutlined
                            color="success"
                            sx={{
                                cursor: "pointer",
                                zIndex: 1000,
                                position: "absolute",
                                left: 0,
                                color: seconds / totalSeconds * 100 < 10 ? "#000000" : "#FFFFFF"
                            }}
                            onClick={handleClickPlay}
                        />
                    }
                    <Stack sx={{position: "absolute", left: {xs: "30%", lg: "45%"}}} direction="row" spacing={2} alignItems="center"
                           justifyContent="center">
                        <Typography
                            sx={{
                                color: seconds / totalSeconds * 100 < 30 ? "#000000" : "#FFFFFF",
                                zIndex: 1000
                            }}
                            variant="body2">
                            {formatTime(parseInt(`${seconds % 60}`))}
                        </Typography>
                        <Typography
                            sx={{
                                zIndex: 1000,
                                color: seconds / totalSeconds * 100 < 40 ? "#000000" : "#FFFFFF",
                            }}
                            variant="body2">
                            :
                        </Typography>
                        <Typography
                            sx={{
                                color: seconds / totalSeconds * 100 < 60 ? "#000000" : "#FFFFFF",
                                zIndex: 1000
                            }}
                            variant="body2">
                            {formatTime(parseInt(`${totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds}`))}
                        </Typography>
                    </Stack>
                    <Close
                        sx={{
                            cursor: "pointer",
                            zIndex: 1000,
                            position: "absolute",
                            right: 0,
                            color: seconds / totalSeconds * 100 < 90 ? "#000000" : "#FFFFFF",
                        }}
                        onClick={handleCancelClick}
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}

export default memo(AudioProgress);
