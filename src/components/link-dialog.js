import {Button, Dialog, DialogContent, Grid, Stack, TextField, Typography} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";

const LinkDialog = ({open, onClose, handleSave}) => {

    const formik = useFormik({
        validateOnBlur: true,
        validateOnChange: true,
        initialValues: {
            link: ''
        },
        onSubmit: (values, {resetForm}) => {
            handleSave(values.link);
            resetForm();
            onClose();
        },
        validationSchema: yup.object().shape({
            link: yup.string().required('URL required').url('Enter a valid URL')
        })
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                        <Typography variant="h6" sx={{color: "text.primary"}}>
                            Enter Link
                        </Typography>
                    </Stack>
                    <TextField
                        label="Link"
                        margin="normal"
                        required={true}
                        fullWidth={true}
                        variant="outlined"
                        onChange={formik.handleChange}
                        value={formik.values.link}
                        error={Boolean(formik.touched.link && formik.errors.link)}
                        helperText={formik.touched.link && formik.errors.link}
                        name="link"
                        type="url"
                        autoFocus={true}
                        placeholder="Enter link"
                    />
                    <Grid container={true} spacing={2}>
                        <Grid item={true} xs={12}>
                            <Button
                                onClick={onClose}
                                color="secondary"
                                fullWidth={true}
                                sx={{textTransform: "capitalize"}}
                                variant="outlined">
                                Close
                            </Button>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Button
                                disableElevation={true}
                                type="submit"
                                color="primary"
                                fullWidth={true}
                                sx={{textTransform: "capitalize"}}
                                variant="contained">
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default LinkDialog;
