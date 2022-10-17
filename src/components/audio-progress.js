import {Card, CardContent, LinearProgress, Stack, Typography} from "@mui/material";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import {CancelOutlined, PauseOutlined, PlayArrowOutlined} from "@mui/icons-material";

const AudioProgress = ({totalSeconds}) => {
    const [state, setState] = useState('inactive');
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null);

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
        }else if(state === 'inactive'){
            setSeconds(0);
            setState('playing');
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
                        <PauseOutlined color="secondary" sx={{cursor: "pointer"}} onClick={() => setState('paused')}/> :
                        <PlayArrowOutlined color="success" sx={{cursor: "pointer"}} onClick={handleClickPlay}/>
                    }
                    <LinearProgress
                        color="secondary"
                        sx={{flex: 1}}
                        value={parseInt(`${seconds / totalSeconds * 100}`)}
                        variant="determinate"
                    />
                    <Typography
                        sx={{color: "secondary.main"}}
                        variant="body1">
                        {formatTime(parseInt(`${seconds / 60}`))} {' : '}
                        {formatTime(parseInt(`${seconds % 60}`))}
                    </Typography>

                    <CancelOutlined color="error" sx={{cursor: "pointer"}} onClick={handleCancelClick}/>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default memo(AudioProgress);
