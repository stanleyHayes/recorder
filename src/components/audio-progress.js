import {Card, CardContent, LinearProgress, Stack, Typography} from "@mui/material";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import {CancelOutlined, PauseOutlined, PlayArrowOutlined} from "@mui/icons-material";

const AudioProgress = ({totalSeconds,  src, audio}) => {
    const [state, setState] = useState('inactive');
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);
    const audioRef = useRef(null);

    console.log(audio);

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
        if(state === 'paused'){
            setState('playing');
            if(audioRef){
                audioRef.current.play();
            }
        }else if(state === 'inactive'){
            setSeconds(0);
            setState('playing');
        }
    }

    const handlePauseClick = () => {
        setState('paused');
        if(audioRef){
            audioRef.current.pause();
        }
    }


    return (
        <Card variant="outlined" sx={{borderRadius: 32, position: "relative"}}>
            <CardContent>
                <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                    {state === 'playing' ?
                        <PauseOutlined color="secondary" sx={{cursor: "pointer"}} onClick={handlePauseClick}/> :
                        <PlayArrowOutlined color="success" sx={{cursor: "pointer"}} onClick={handleClickPlay}/>
                    }
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography
                            sx={{color: "text.primary"}}
                            variant="body2">
                            {formatTime(parseInt(`${seconds / 60}`))} {' : '}
                            {formatTime(parseInt(`${seconds % 60}`))}
                        </Typography>
                        <Typography
                            sx={{color: "text.primary"}}
                            variant="body2">
                            /
                        </Typography>
                        <Typography
                            sx={{color: "text.primary"}}
                            variant="body2">
                            {formatTime(parseInt(`${totalSeconds / 60}`))} {' : '}
                            {formatTime(parseInt(`${totalSeconds % 60}`))}
                        </Typography>
                    </Stack>

                    <LinearProgress
                        color="secondary"
                        sx={{flex: 1}}
                        value={parseInt(`${seconds / totalSeconds * 100}`)}
                        variant="determinate"
                    />

                    <CancelOutlined color="error" sx={{cursor: "pointer"}} onClick={handleCancelClick}/>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default memo(AudioProgress);
