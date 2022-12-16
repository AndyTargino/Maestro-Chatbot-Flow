import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, MenuItem } from '@mui/material';
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

var defaultQueues = [{ 'id': 'finish', 'name': 'FInalizar atendimento' }];

const EditFlowModal = ({
    queues,
    propsObject,
    open,
    onClose,
    onConfirm }) => {

    const [titleMessage, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [filas, setFilas] = useState(defaultQueues);
    const [color, setColor] = useState({ background: '#414141' });

    const handleChangeComplete = (color) => setColor({ background: color.hex });

    useEffect(() => { if (propsObject) { setMessage(propsObject.lastMessage); setTitle(propsObject.lastTitle); setColor({ background: propsObject.background }) } }, [propsObject, open]);

    console.warn(filas);

    useEffect(() => {
        setFilas(pre => [...pre, queues[0]])
    }, [queues]);

    const renderOption = e => {
        console.warn(e.target)
    }


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
                    {propsObject?.position === 'end' && <>
                        <TextField
                            style={{ margin: '5px 0px 35px 0px' }}
                            multiline
                            fullWidth
                            select
                            onChange={e => renderOption(e)}
                            label="Mensagem"
                            variant="outlined">
                            {queues.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.name}
                                </MenuItem>
                            ))}
                            <MenuItem key={'finish'} value='finish'>
                                Finalizar atendimento
                            </MenuItem>
                        </TextField>
                    </>}
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
