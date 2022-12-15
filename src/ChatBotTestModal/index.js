
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

import FlowChatBot from "../FlowChatBot"

import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
    paper: {
        position: "absolute !important",
        right: 10,
        bottom: 10,
        overflow: 'hidden !important'
    }
});

const ChatBotTestModal = ({ open, onClose, chatBotFlow }) => {

    const classes = useStyles();

    const [messagesBot, setMessagesBot] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stepUser, setStepUser] = useState(['start']);

    useEffect(() => {

        if (open) {

            var message = FlowChatBot(chatBotFlow, stepUser)
            if (message === '') { message = 'Escolha uma opção valida'; }

            defineNewMessage(false, message);

        } else {

            setMessagesBot([]);

        }

    }, [open, stepUser]);

    useEffect(() => { if (!open) { setMessagesBot([]); } }, [open]);

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
        <div id="chatbot">
            <Dialog
                classes={{ paper: classes.paper }}
                open={open}
                onClose={() => closeModalChat()}
                aria-labelledby="confirm-dialog"
            >
                <div style={{
                    backgroundColor: 'rgb(221, 221, 221)',
                    width: '340px',
                    height: '435px',
                    margin: '0px 0px',
                }}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: '5%',
                        padding: '10px 0px 0px 0px',
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><p>Teste de fluxo do BOT</p></div>
                    <div
                        id="body_Bot"
                        style={{
                            maxHeight: '80%',
                            overflow: 'auto',
                            display: 'flex',
                            width: '94%',
                            margin: '10px 10px 0px 9px',
                            height: '80%',
                            backgroundColor: '#ffffff',
                            flexDirection: 'column',
                        }}>
                        <>{open && messagesBot.map((msg) => (
                            <>
                                {msg.message !== '' && <>
                                    {msg.fromMe === true ?
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                width: '100%'
                                            }}>
                                                <div style={{
                                                    textAlign: 'end',
                                                    border: 'solid 1px #888888',
                                                    color: 'white',
                                                    borderRadius: '10px 0px 10px 10px',
                                                    backgroundColor: '#888888',
                                                    margin: '5px 5px 5px 0px',
                                                    padding: '0px 5px 0PX 5PX',
                                                    fontSize: '14px',
                                                    //  wordBreak: 'break-all',
                                                    maxWidth: '200px'
                                                }}>
                                                    <p style={{ whiteSpace: 'pre-line', margin: '5px 0px 5px 0px' }}>{msg.message}</p>
                                                </div>
                                            </div>
                                        </> : <>
                                            <div style={{
                                                display: 'flex',
                                                width: '100%'
                                            }}>
                                                <div style={{
                                                    border: 'solid 1px #dad0d0',
                                                    borderRadius: '0px 10px 10px 10px',
                                                    backgroundColor: '#c3c3c300',
                                                    margin: '5px 0px 5px 5px',
                                                    padding: '0px 5px 0PX 5PX',
                                                    fontSize: '14px',
                                                    // wordBreak: 'break-all',
                                                    maxWidth: '200px'
                                                }}>
                                                    <p style={{ whiteSpace: 'pre-line', margin: '5px 0px 5px 0px' }}>{msg.message}</p>
                                                </div>
                                            </div>
                                        </>}
                                </>
                                }</>
                        ))}
                        </>
                    </div>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: '10%',
                        justifyContent: 'center'
                    }}>
                        <input
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={e => onClickSend(e.key)}
                            style={{
                                width: '80%',
                                height: '30px',
                                borderRadius: '0px 0px 0px 5px',
                                border: 'solid 1px #bbbbbb'
                            }} type="text" />
                        <button
                            onClick={e => onClickSend('Enter')}
                            style={{
                                width: '12%',
                                height: '34px',
                                borderRadius: '0px 0px 5px',
                                border: 'solid 1px #bbbbbb',
                                backgroundColor: 'white'
                            }}>
                            <SendIcon style={{ width: '17px' }} />
                        </button>
                    </div>
                </div>
            </Dialog >
        </div >

    );
};

export default ChatBotTestModal;