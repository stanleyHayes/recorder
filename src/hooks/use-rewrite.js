import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {CONSTANTS} from "../utils/constants";

const useRewrite = ({intent, text}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios({
                method: 'POST',
                url: CONSTANTS.REWRITE_URL,
                headers: {
                    Authorization: `Bearer ${CONSTANTS.REWRITE_API_KEY}`
                },
                data: {
                    intent, text
                }
            });
            const {suggestions} = await response.data;
            setSuggestions(suggestions);
            setLoading(false);
        }catch (e) {
            console.log(e.message)
            setError(e.response.data);
        }
    }, [text, intent]);

    useEffect(() => {
        if(intent && text !== ""){
            getSuggestions().then();
        }
    }, [getSuggestions, text, intent]);

    return {suggestions, error, loading, setSuggestions};
}


export default useRewrite;
