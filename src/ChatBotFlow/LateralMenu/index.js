import React, {
    useState,
    useCallback,
    useEffect
} from "react";

import {
    Box,
    Drawer,
    Divider,
    IconButton,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField, MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@mui/material';

import { makeStyles } from '@mui/styles';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MoveUpIcon from '@mui/icons-material/MoveUp';

import { SliderPicker } from 'react-color';

const useStyles = makeStyles({
    input: {
        margin: '10px 0px 10px 0px !important'
    },
    radioGroup: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});

const LateralMenu = ({
    open,
    onClose,
    propsObject,
    queues,
    onConfirm
}) => {

    const classes = useStyles();

    const [titleMessage, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [afterMessage, setAfterMessage] = useState('');
    const [type, setType] = useState(propsObject?.position);
    const [queueSelected, setQueueSelected] = useState(0);
    const [color, setColor] = useState({ background: '#414141' });
    const handleChangeComplete = (color) => setColor({ background: color.hex });

    const [drawerWidth, setDrawerWidth] = useState(300);

    useEffect(() => { if (!open) { setDrawerWidth(0); } else { setDrawerWidth(300); } }, [open]);

    useEffect(() => { if (propsObject && open) { setQueueSelected(propsObject.endFlowOption); setType(propsObject.position); setMessage(propsObject.lastMessage); setTitle(propsObject.lastTitle); setColor({ background: propsObject.background }) } }, [propsObject, open]);

    const saveData = () => { setTimeout(() => onClose(false), 500); onConfirm(titleMessage, message, afterMessage, color.background, queueSelected, type); setQueueSelected(0); }

    const selectedQueue = (queue) => setQueueSelected(queue);

    return (
        <>
            <Drawer component='div' sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <Box component='div'>
                    <IconButton onClick={e => onClose(false)}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Box component='div' style={{ padding: 10, height: '100%' }}>
                    <Box component='div'>
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
                                {/* 
                                
                                Salvar resposta será implementado futuramente, pois a regra de chat para salvar os dados ainda não foi criada na aplicação 
                                
                                <MenuItem key={'capture'} value={'capture'}>
                                    <Box component='div' style={{ display: 'flex' }}> Salvar resposta <MarkEmailReadIcon style={{ marginLeft: 5 }} /></Box>
                                </MenuItem>

                                */}

                                <MenuItem key={0} value={0}>
                                    <Box component='div' style={{ display: 'flex' }}> Finalizar atendimento <DoneAllIcon style={{ marginLeft: 5 }} /></Box>
                                </MenuItem>
                            </TextField>
                            <>
                                {
                                    queueSelected === 'capture' && <>
                                        <TextField
                                            className={classes.input}
                                            multiline
                                            fullWidth
                                            value={afterMessage}
                                            onChange={e => setAfterMessage(e.target.value)}
                                            label="Resposta após captura"
                                            variant="outlined" />
                                    </>
                                }
                            </>
                        </>
                        }
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
                    <Divider />
                    <Box component='div' style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
                        <Button variant="contained" color="error" onClick={() => onClose(false)}>Cancelar</Button>
                        <Button variant="contained" color="primary" onClick={() => { saveData(); }}>Confirmar</Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

export default LateralMenu;