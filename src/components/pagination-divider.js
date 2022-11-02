import {Divider} from "@mui/material";

const PaginationDivider = ({page}) => {
    return (
        <Divider light={true} textAlign="left">{`Page ${page}`}</Divider>
    )
}

export default PaginationDivider;
