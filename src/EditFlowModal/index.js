import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, MenuItem } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
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
    queues,
    propsObject,
    open,
    onClose,
    onConfirm }) => {


    const [titleMessage, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState(propsObject?.position);
    const [queueSelected, setQueueSelected] = useState(0);
    const [color, setColor] = useState({ background: '#414141' });
    const handleChangeComplete = (color) => setColor({ background: color.hex });

    console.info(propsObject);

    useEffect(() => { if (propsObject && open) { setType(propsObject.position); setMessage(propsObject.lastMessage); setTitle(propsObject.lastTitle); setColor({ background: propsObject.background }) } }, [propsObject, open]);

    const saveData = () => { onClose(false); onConfirm(titleMessage, message, color.background, queueSelected, type); setQueueSelected(0); }

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle
                style={{ lineBreak: 'auto', maxWidth: '275px' }}
                id="confirm-dialog"
            >{`Editando objeto ${propsObject?.lastTitle}`}</DialogTitle>
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
                            value={queueSelected}
                            select
                            onChange={e => setQueueSelected(e.target.value)}
                            label="Finalizar fluxo"
                            variant="outlined">
                            {queues.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    Transferir para {option.name}
                                </MenuItem>
                            ))}
                            <MenuItem key={0} value={0}>
                                Finalizar atendimento
                            </MenuItem>
                        </TextField>
                    </>}
                    {type != 'start' &&
                        <>
                            <label>Tipo</label>
                            <RadioGroup
                                hidden={propsObject?.position !== 'start' ? false : true}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                                row
                                onChange={e => setType(e.target.value)}
                                value={type}
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="end" control={<Radio />} label="Finalização" />
                                <FormControlLabel value="conditional" control={<Radio />} label="Condicional" />
                            </RadioGroup>
                        </>
                    }

                    <SliderPicker
                        color={color.background}
                        onChangeComplete={handleChangeComplete}
                    />
                </div>
            </DialogContent>
            <DialogActions>

                <Button variant="contained" color="error" onClick={() => onClose(false)}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={() => { saveData(); }}>Confirmar</Button>

            </DialogActions>
        </Dialog >
    );
};

export default EditFlowModal;
