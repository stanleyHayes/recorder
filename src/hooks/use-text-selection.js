import {useEffect, useState} from "react";

const useTextSelection = () => {
    const [highlightedText, setHighlightedText] = useState("");
    const [words, setWords] = useState([]);

    useEffect(() => {
        document.addEventListener("selectionchange", () => {
            const highlightedText = document.getSelection().toString();
            setHighlightedText(highlightedText);
            if(highlightedText){
                const words = highlightedText.split(" ");
                if(words.length > 0){
                    setWords(words);
                }
            }
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                setWords([]);
                setHighlightedText("");
            });
        }
    }, []);

    return {highlightedText, words};
}

export default useTextSelection;
