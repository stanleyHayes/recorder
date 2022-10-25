import {Box, Button, Card, CardContent, Container, Stack} from "@mui/material";
import {useQuill} from "react-quilljs";
import "quill/dist/quill.snow.css";
import {useState} from "react";
import LinkDialog from "./link-dialog";

const TextEditor = () => {
    const options = {
        modules: {toolbar: false}
    };

    const {quill, quillRef} = useQuill(options);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [length, setLength] = useState(0);
    const [selectedText, setSelectedText] = useState("");
    const [text, setText] = useState("");

    const toggleBold = () => {
        const range = quill.getSelection();
        const format = quill.getFormat(range.index, range.length);
        quill.formatText(range.index, range.length, 'bold', !format?.bold, 'api');
    }
    const italicize = () => {
        const range = quill.getSelection();
        const format = quill.getFormat(range.index, range.length);
        quill.formatText(range.index, range.length, 'italic', !format?.italic, 'api');
    }
    const insertLink = (index, length, link, text) => {
        quill.insertText(index, text, "link", link, 'api');
    }

    const handleOpen = () => {
        const range = quill.getSelection();
        setIndex(range.index);
        setSelectedText(quill.getText(range.index, range.length));
        setLength(range.length);
        setOpen(true);
    }

    const handleAdd = link => {
        insertLink(index, length, link, selectedText);
        quill.deleteText(index + length, length, "api");
    };

    const handleSend = () => {
        setText(quill.getText());
    }

    console.log(text);

    return (
        <Box sx={{py: 2}}>
            <Container>
                <Stack direction="column" spacing={3}>
                    <Stack direction="row" spacing={3}>
                        <Button onClick={toggleBold} variant="contained" disableElevation={true}>Bold</Button>
                        <Button onClick={italicize} variant="contained" disableElevation={true}>Italic</Button>
                        <Button onClick={handleOpen} variant="contained" disableElevation={true}>Insert Link</Button>
                    </Stack>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="column" spacing={3}>
                                <Box ref={quillRef}>

                                </Box>
                                <Button onClick={handleSend} variant="contained" disableElevation={true}>Send</Button>
                                {text && <Box dangerouslySetInnerHTML={{__html: text}}/>}
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
                {open && (
                    <LinkDialog
                        open={open}
                        onClose={() => setOpen(false)}
                        handleSave={handleAdd}
                    />
                )}
            </Container>
        </Box>
    )
}

export default TextEditor;
