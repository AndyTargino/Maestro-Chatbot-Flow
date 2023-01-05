
import React, { useState, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';
import {
    Menu,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Button,
    DialogActions
} from '@mui/material';

import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    paper: {
        position: "absolute",
        left: 0,
        bottom: 0
    }
});

const ChatBotTestModal = ({ open, onClose, chatProps }) => {

    const classes = useStyles()

    return (
        <Box component='div'  id="chatbot">
            <Dialog
                classes={{ paper: classes.paper }}
                open={open}
                onClose={() => onClose(false)}
                aria-labelledby="confirm-dialog"
            >
                <DialogTitle id="confirm-dialog">{'Teste CHATBOT'}</DialogTitle>
                <DialogContent dividers>
                    <Typography>{'ok'}</Typography>
                </DialogContent>
            </Dialog>
        </Box>

    );
};

export default ChatBotTestModal;