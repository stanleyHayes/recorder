import {createContext, useContext, useEffect, useMemo, useState} from "react";

const ProgressContext = createContext(null);

const ProgressProvider = ({children}) => {

    const [wordCount, setWordCount] = useState(0);
    const [audioLength, setAudioLength] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (wordCount > 10) {
            setProgress(24);
        } else if (wordCount > 20) {
            setProgress(49);
        } else if (wordCount > 30) {
            setProgress(74);
        } else if (wordCount > 40) {
            setProgress(100);
        }
    }, [wordCount]);

    useEffect(() => {
        if (audioLength > 10) {
            setProgress(24);
        } else if (audioLength > 20) {
            setProgress(49);
        } else if (audioLength > 30) {
            setProgress(74);
        } else if (audioLength > 40) {
            setProgress(100);
        }
    }, [audioLength]);


    const contextValue = useMemo(() => {
        return {
            progress,
            setWordCount,
            setAudioLength
        }
    }, [progress]);

    return (
        <ProgressContext.Provider value={contextValue}>
            {children}
        </ProgressContext.Provider>)
}

export const useProgress = () => {
    const value = useContext(ProgressContext);
    if(!value){
        throw new Error(`You probably forgot to wrap your app with <ProgressProvider>`)
    }
    return value;
}

export default ProgressProvider;
