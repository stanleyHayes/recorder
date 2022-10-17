import {useEffect, useState} from "react";

const useTextSelection = () => {
    const [text, setText] = useState("");
    const [words, setWords] = useState([]);

    useEffect(() => {
        document.addEventListener("selectionchange", () => {
            const text = document.getSelection().toString();
            setText(text);
            if(text){
                const words = text.split(" ");
                if(words.length > 0){
                    setWords(words);
                }
            }
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                setWords([]);
                setText("");
            });
        }
    }, []);

    return {text, words};
}

export default useTextSelection;
