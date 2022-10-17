import './App.css';
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    ClickAwayListener,
    Container,
    Divider,
    LinearProgress,
    Stack,
    Typography
} from "@mui/material";
import useRecordAudio from "./hooks/use-record-audio";
import useTextSelection from "./hooks/use-text-selection";
import useRewrite from "./hooks/use-rewrite";
import {Fragment, useEffect, useState} from "react";

function App() {

    const {
        connecting,
        resumeRecording,
        startRecording,
        src,
        stopRecording,
        pauseRecording,
        error,
        state, seconds, audio
    } = useRecordAudio({});

    const {words, text} = useTextSelection();

    const {suggestions, error: e, loading, setSuggestions} = useRewrite({text, intent: "general"});
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleClickAway = () => {
        setShowSuggestions(false);
        setSuggestions();
    }

    useEffect(() => {
        if (suggestions) {
            setShowSuggestions(true);
        }
    }, [showSuggestions, suggestions]);

    const highlightText = text => {
        let highlightedText = text;
        words.forEach(word => {
            if (highlightedText.toLowerCase().includes(word.toLowerCase())) {
                highlightedText = highlightedText.replace(word.toLowerCase(), replacement(word.toLowerCase()));
            }
        })
        return highlightedText;
    }

    const replacement = word => {
        return `<span style={{backgroundColor: "blue", color: "white", borderRadius: 2, padding: 4, fontSize: 50, fontWeight: "bold"}}>${word}</span>`;
    }

    return (
        <Box>
            {connecting && <LinearProgress variant="query" color="secondary"/>}
            {loading && <LinearProgress variant="query" color="secondary"/>}
            <Container sx={{py: 4}}>
                {error && (
                    <Alert severity="error">
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}
                {e && e.message && (
                    <Alert severity="error">
                        <AlertTitle>{e.message}</AlertTitle>
                    </Alert>
                )}

                <Box>

                    {src && (
                        <CardMedia controls={!!src} component="audio" src={src}/>
                    )}

                    <Button>{seconds}</Button>

                    <Stack direction="column" spacing={2} alignItems="center">
                        {state === "inactive" ? (
                            <Box>
                                <Button onClick={() => startRecording()}>Start Recording</Button>
                            </Box>
                        ) : state === "recording" ? (
                            <Box>
                                <Button onClick={() => pauseRecording()}>Pause Recording</Button>
                                <Button onClick={() => stopRecording()}>Stop Recording</Button>
                            </Box>
                        ) : state === "paused" ? (
                            <Button onClick={() => resumeRecording()}>Resume Recording</Button>
                        ) : null}

                    </Stack>
                </Box>


                <Box sx={{position: "relative", width: '40%', display: suggestions && showSuggestions ? "block" : "none",}}>
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 4,
                                position: "absolute",
                                left: "50%",
                                top: '50%',
                                backgroundColor: "rgba(0, 0, 0, 0.4)",
                                transform: "translate(-50%, 10%)",
                                zIndex: -1000
                            }}>
                            <CardContent>
                                {suggestions && showSuggestions && (
                                    <Stack
                                        direction="column"
                                        spacing={1}
                                        divider={<Divider variant="fullWidth" light={true}/>}>
                                        {suggestions.map((suggestion, index) => {
                                            return (
                                                <Fragment key={index}>
                                                    <div
                                                        style={{color: "white"}}
                                                        dangerouslySetInnerHTML={{__html: highlightText(suggestion.text)}}
                                                    />
                                                </Fragment>
                                            )
                                        })}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </ClickAwayListener>
                    <Typography variant="h5" align="center">
                        How far is the city from here.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default App;
