
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

import Box from '@mui/material/Box';

import FlowChatBot from "../FlowChatBot"

import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    paper: {
        position: "absolute !important",
        right: 10,
        bottom: 10,
        overflow: 'hidden !important'
    },
    chatCard: {
        backgroundColor: 'rgb(221, 221, 221)',
        width: '340px',
        height: '435px',
        margin: '0px 0px',
    },
    chat: {
        display: 'flex',
        width: '100%',
        height: '5%',
        padding: '10px 0px 0px 0px',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyBot: {
        maxHeight: '80%',
        overflow: 'auto',
        display: 'flex',
        width: '94%',
        margin: '10px 10px 0px 9px',
        height: '80%',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    leftChat: {
        display: 'flex',
        width: '100%'
    },
    leftChatContent: {
        border: 'solid 1px #dad0d0',
        borderRadius: '0px 10px 10px 10px',
        backgroundColor: '#c3c3c300',
        margin: '5px 0px 5px 5px',
        padding: '0px 5px 0PX 5PX',
        fontSize: '14px',
        maxWidth: '200px'
    },
    rightChat: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
    },
    rightChatContent: {
        textAlign: 'end',
        border: 'solid 1px #888888',
        color: 'white',
        borderRadius: '10px 0px 10px 10px',
        backgroundColor: '#888888',
        margin: '5px 5px 5px 0px',
        padding: '0px 5px 0PX 5PX',
        fontSize: '14px',
        maxWidth: '200px'
    },
    content: {
        whiteSpace: 'pre-line', margin: '5px 0px 5px 0px'
    },
    inputContent: {
        display: 'flex',
        width: '100%',
        height: '10%',
        justifyContent: 'center'
    },
    inputStyle: {
        width: '80%',
        height: '30px',
        borderRadius: '0px 0px 0px 5px',
        border: 'solid 1px #bbbbbb'
    },
    inputButton: {
        width: '12%',
        height: '34px',
        borderRadius: '0px 0px 5px',
        border: 'solid 1px #bbbbbb',
        backgroundColor: 'white'
    }
});

const ChatBotTestModal = ({ open, onClose, chatBotFlow }) => {

    const classes = useStyles();

    const [messagesBot, setMessagesBot] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stepUser, setStepUser] = useState(['start']);

    useEffect(() => {

        if (open) {

            let { message, array, step ,type} = FlowChatBot(chatBotFlow, stepUser)

            if (message === '') { message = 'Escolha uma opção valida'; }
            setTimeout(() => { defineNewMessage(false, message); }, 500);
        } else {
            setMessagesBot([]);
        }

    }, [open, stepUser]);

    useEffect(() => {
        if (!open) {
            let input = document.querySelector("#inputChatBot")
            if (input) { input.disabled = false; }
            setMessagesBot([]);
        }
    }, [open]);

    const defineNewMessage = (fromMe, message) => {
        const body = document.getElementById('body_Bot');
        setMessagesBot(pre => [...pre, { 'fromMe': fromMe, 'message': message }]);
        setInputValue('');
        setTimeout(() => { body.scrollTop = body.scrollHeight + 500; }, 150);
    }

    const onClickSend = e => {
        if (e !== 'Enter' || String(inputValue).length < 1) return;
        setStepUser(old => [...old, inputValue])
        defineNewMessage(true, inputValue);
    }

    const closeModalChat = () => {
        setStepUser(['start'])
        setMessagesBot([]);
        onClose(false)
    }

    return (
        <Box component='div' id="chatbot">
            <Dialog
                classes={{ paper: classes.paper }}
                open={open}
                onClose={() => closeModalChat()}
                aria-labelledby="confirm-dialog"
            >
                <Box component='div' className={classes.chatCard}>
                    <Box component='div' className={classes.chat}><p>Teste de fluxo do BOT</p></Box>
                    <Box component='div'
                        className={classes.bodyBot}
                        id="body_Bot">
                        <>{open && messagesBot.map((msg) => (
                            <>
                                {msg.message !== '' && <> {msg.fromMe === true ?
                                    <>
                                        <Box component='div' className={classes.rightChat} >
                                            <Box component='div' className={classes.rightChatContent} >
                                                <p className={classes.content}>{msg.message}</p>
                                            </Box>
                                        </Box>
                                    </> : <>
                                        <Box component='div' className={classes.leftChat} >
                                            <Box component='div' className={classes.leftChatContent} >
                                                <p className={classes.content}>{msg.message}</p>
                                            </Box>
                                        </Box>
                                    </>
                                }
                                </>
                                }
                            </>
                        ))}
                        </>
                    </Box>
                    <Box component='div' className={classes.inputContent} >
                        <input
                            autoComplete="off"
                            id="inputChatBot"
                            className={classes.inputStyle}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={e => onClickSend(e.key)} type="text" />
                        <button
                            className={classes.inputButton}
                            onClick={e => onClickSend('Enter')}
                        >
                            <SendIcon style={{ width: '17px' }} />
                        </button>
                    </Box>
                </Box>
            </Dialog >
        </Box>

    );
};

export default ChatBotTestModal;