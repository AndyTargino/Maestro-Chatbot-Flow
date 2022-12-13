import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from '@mui/material/TextField';
import {
    // AlphaPicker,
    // BlockPicker,
    // ChromePicker,
    // CirclePicker,
    // CompactPicker,
    // GithubPicker,
    // HuePicker,
    // MaterialPicker,
    // PhotoshopPicker,
    // SketchPicker,
    SliderPicker,
    //  SwatchesPicker,
    //  TwitterPicker
} from 'react-color';


const EditFlowModal = ({
    //title,
    propsObject,
    open,
    onClose,
    onConfirm }) => {

    const [titleMessage, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [color, setColor] = useState({ background: '#414141' });

    const handleChangeComplete = (color) => {
        setColor({ background: color.hex });
    };

    useEffect(() => { if (propsObject) { setMessage(propsObject.lastMessage); setTitle(propsObject.lastTitle); setColor({ background: propsObject.background }) } }, [propsObject, open]);

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">{`Editando objeto ${propsObject?.lastTitle}`}</DialogTitle>
            <DialogContent dividers>
                <div style={{ maxWidth: '275px' }}>
                    <TextField
                        style={{ margin: '5px 0px 35px 0px' }}
                        value={titleMessage}
                        onChange={e => setTitle(e.target.value)}
                        label="Titulo"
                        variant="outlined"
                        fullWidth />
                    <TextField
                        style={{ margin: '5px 0px 35px 0px' }}
                        multiline
                        fullWidth
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        label="Mensagem"
                        variant="outlined" />

                    <SliderPicker
                        color={color.background}
                        onChangeComplete={handleChangeComplete}
                    />
                </div>
            </DialogContent>
            <DialogActions>

                <Button variant="contained" color="error" onClick={() => onClose(false)}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={() => { onClose(false); onConfirm(titleMessage, message, color.background); }}>Confirmar</Button>

            </DialogActions>
        </Dialog>
    );
};

export default EditFlowModal;
