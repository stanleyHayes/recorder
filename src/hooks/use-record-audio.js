import {useCallback, useEffect, useRef, useState} from "react";

const useRecordAudio = ({
                            onStartRecording,
                            onPauseRecording,
                            onResumeRecording,
                            onStopRecording,
                            onError,
                            onConnected
                        }) => {
    const [src, setSrc] = useState("");
    const [error, setError] = useState("");
    const [isSupported, setIsSupported] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [chunks] = useState([]);
    const [connecting, setConnecting] = useState(false);
    const [state, setState] = useState("inactive");
    const [audio, setAudio] = useState(null);
    const [seconds, setSeconds] = useState(0);
    let intervalRef = useRef(null);

    useEffect(() => {
        if(mediaRecorder?.state === 'recording'){
            intervalRef.current = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalRef.current);
        }
    }, [mediaRecorder?.state]);

    const startRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setState(mediaRecorder?.state);
        }
        if (onStartRecording) {
            onStartRecording();
        }
    }, [mediaRecorder, onStartRecording]);

    const pauseRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.pause();
            setState(mediaRecorder?.state);
        }
        if (onPauseRecording) {
            onPauseRecording();
        }
    }, [mediaRecorder, onPauseRecording]);

    const resumeRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.resume();
        }
        if (onResumeRecording) {
            onResumeRecording();
        }
    }, [mediaRecorder, onResumeRecording]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setState(mediaRecorder?.state);
        }
        if (onStopRecording) {
            onStopRecording(seconds);
        }
    }, [mediaRecorder, onStopRecording, seconds]);

    useEffect(() => {
        if (!navigator.mediaDevices) {
            setIsSupported(false);
            setState("invalid");
            setError("Your device does not support this feature");
        }
    }, []);

    useEffect(() => {
        if (mediaRecorder) {
            mediaRecorder.addEventListener("resume", () => {
                setState(mediaRecorder?.state);
                if (onResumeRecording) {
                    onResumeRecording();
                }
            });
        }

        if (mediaRecorder) {
            return () => {
                mediaRecorder.removeEventListener("resume", () => {

                })
            }
        }
    }, [mediaRecorder, onResumeRecording]);

    useEffect(() => {
        if (mediaRecorder) {
            mediaRecorder.addEventListener("stop", () => {
                setState(mediaRecorder?.state);
                const blob = new Blob(chunks, {type: "audio/wav"});
                const audioURL = URL.createObjectURL(blob);
                setSrc(audioURL);
                setAudio(blob);
                if(onStopRecording){
                    onStopRecording(seconds);
                    setSeconds(0);
                }
            });
        }
        if (mediaRecorder) {
            return () => {
                mediaRecorder.removeEventListener("stop", () => {

                });
            }
        }
    }, [chunks, mediaRecorder, onStopRecording, seconds]);

    useEffect(() => {
        if (mediaRecorder) {
            mediaRecorder.addEventListener("pause", () => {
                setState(mediaRecorder?.state);
                if (onPauseRecording) {
                    onPauseRecording();
                }
            });
        }
        if (mediaRecorder) {
            return () => {
                mediaRecorder.removeEventListener("pause", () => {

                });
            }
        }
    }, [mediaRecorder, onPauseRecording]);

    useEffect(() => {
        setConnecting(true);
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
            setMediaRecorder(new MediaRecorder(stream));
            setConnecting(false);
            if (onConnected) {
                onConnected();
            }
        }).catch(error => {
            setError(error);
            setConnecting(false);
        })
    }, [onConnected]);


    /*
    * Effect hook that attaches start event listener to media recorder
    * This event is fired when recording starts
    * */
    useEffect(() => {
        if (mediaRecorder) {
            mediaRecorder.addEventListener("start", () => {
                setState(mediaRecorder?.state);
                if (onStartRecording) {
                    onStartRecording();
                }
            })
        }
        if (mediaRecorder) {
            return () => {
                mediaRecorder.removeEventListener("start", () => {

                });
            }
        }
    }, [mediaRecorder, onStartRecording]);

    /*
    * Effect hook that attaches error event listener to media recorder
    * This event is fired when an error occurs
    * It sets the error state to the error received which can be displayed to user
    * */
    useEffect(() => {
        if (mediaRecorder) {
            mediaRecorder.addEventListener("error", (error) => {
                setState(mediaRecorder?.state);
                setError(error);
                if (onError) {
                    onError();
                }
            });
        }
        if (mediaRecorder) {
            return () => {
                mediaRecorder.removeEventListener("error", () => {
                });
            }
        }
    }, [mediaRecorder, onError]);

    useEffect(() => {
        if (mediaRecorder) {
            setState(mediaRecorder?.state);
            mediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
                setAudio(event.data);
                setSrc(URL.createObjectURL(event.data));
            });
        }
    }, [chunks, mediaRecorder]);

    return {
        error,
        isSupported,
        src,
        pauseRecording,
        resumeRecording,
        stopRecording,
        startRecording,
        connecting,
        state,
        audio,
        seconds
    };
}


export default useRecordAudio;
