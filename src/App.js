import './App.css';
import {Alert, AlertTitle, Box, Button, CardMedia, Container, LinearProgress, Stack} from "@mui/material";
import useRecordAudio from "./hooks/use-record-audio";

function App() {

    const {
        connecting,
        resumeRecording,
        startRecording,
        src,
        stopRecording,
        pauseRecording,
        error,
        state
    } = useRecordAudio({});

    console.log(state, 'state');

    return (
        <Box sx={{py: 4}}>
            <Container>
                {connecting && <LinearProgress variant="query" color="secondary"/>}
                {error && (
                    <Alert severity="error">
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                )}
                <Box>

                    {src && (
                        <CardMedia controls={!!src} component="audio" src={src}/>
                    )}

                    <Stack direction="column" spacing={2} alignItems="center">
                        {state === "inactive" ? (
                            <Box>
                                <Button onClick={() => startRecording()}>Start Recording</Button>
                            </Box>
                        ): state === "recording" ? (
                            <Box>
                                <Button onClick={() => pauseRecording()}>Pause Recording</Button>
                                <Button onClick={() => stopRecording()}>Stop Recording</Button>
                            </Box>
                        ): state === "paused" ? (
                            <Button onClick={() => resumeRecording()}>Resume Recording</Button>
                        ): null}

                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}

export default App;
