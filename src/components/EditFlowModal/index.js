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
import Box from '@mui/material/Box';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MoveUpIcon from '@mui/icons-material/MoveUp';

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
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    input: {
        margin: '10px 0px 10px 0px !important'
    },
    radioGroup: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});



const EditFlowModal = ({
    queues,
    propsObject,
    open,
    onClose,
    onConfirm }) => {

    const classes = useStyles();

    const [titleMessage, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState(propsObject?.position);
    const [queueSelected, setQueueSelected] = useState(0);
    const [color, setColor] = useState({ background: '#414141' });
    const handleChangeComplete = (color) => setColor({ background: color.hex });



    useEffect(() => { if (propsObject && open) { setQueueSelected(propsObject.endFlowOption); setType(propsObject.position); setMessage(propsObject.lastMessage); setTitle(propsObject.lastTitle); setColor({ background: propsObject.background }) } }, [propsObject, open]);

    const saveData = () => { onClose(false); onConfirm(titleMessage, message, color.background, queueSelected, type); setQueueSelected(0); }

    const selectedQueue = (queue) => {
        setQueueSelected(queue);
    }
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
                <Box component='div' style={{ maxWidth: '275px' }}>
                    <TextField
                        className={classes.input}
                        value={titleMessage}
                        onChange={e => setTitle(e.target.value)}
                        label="Titulo"
                        variant="outlined"
                        fullWidth />
                    <TextField
                        className={classes.input}
                        multiline
                        fullWidth
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        label="Mensagem"
                        variant="outlined" />
                    {propsObject?.position === 'end' && <>
                        <TextField
                            className={classes.input}
                            multiline
                            fullWidth
                            value={queueSelected}
                            select
                            onChange={e => selectedQueue(e.target.value)}
                            label="Finalizar fluxo"
                            variant="outlined">
                            {queues.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    <Box component='div' style={{ display: 'flex' }}>  Transferir para {option.name} <MoveUpIcon style={{ marginLeft: 5 }} /></Box>
                                </MenuItem>
                            ))}
                            <MenuItem key={0} value={0}>
                                <Box component='div' style={{ display: 'flex' }}> Finalizar atendimento <DoneAllIcon style={{ marginLeft: 5 }} /></Box>
                            </MenuItem>
                        </TextField>
                    </>}
                    {type != 'start' &&
                        <Box component='div' style={{ display: 'none' }}>
                            <label>Tipo</label>
                            <RadioGroup
                                hidden={propsObject?.position !== 'start' ? false : true}
                                className={classes.radioGroup}
                                row
                                onChange={e => setType(e.target.value)}
                                value={type}
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                            >
                                <FormControlLabel value="end" control={<Radio />} label="Finalização" />
                                <FormControlLabel value="conditional" control={<Radio />} label="Condicional" />
                            </RadioGroup>
                        </Box>
                    }

                    <SliderPicker
                        color={color.background}
                        onChangeComplete={handleChangeComplete}
                    />
                </Box>
            </DialogContent>
            <DialogActions>

                <Button variant="contained" color="error" onClick={() => onClose(false)}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={() => { saveData(); }}>Confirmar</Button>

            </DialogActions>
        </Dialog >
    );
};

export default EditFlowModal;
