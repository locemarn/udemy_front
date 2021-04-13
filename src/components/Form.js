import { useState } from "react";
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

const url = 'http://localhost:5000/api';

export default function Form() {

  const [curso, setCurso] = useState('');
  const [result, setResult] = useState('');
  const [err, setErr] = useState(false);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changeHandler = (e) => {
    if (e.target.value === '') {
      return false
    }
    setCurso(e.target.value)
  }

  const submitHandler = (e) => {
    e.preventDefault()

    setIsLoading(true)
    axios.post(url, {"course": curso})
      .then(({ data }) => {

        console.log('data', data)

        if(data.status !== 200) {
          setErr(true)
        }
        setIsLoading(false)

        setResult(data.result)
        setModal(true)

      })
      .catch(err => {
        setErr(true)
        setIsLoading(true)
      })
  }

  return (
    <Grid container spacing={3} justify={"center"} alignItems={"center"} style={{ width: '100%', height: '100vh', backgroundColor: '#d2d2d2'}}>
      {!isLoading && <Grid item xs={6}>
        <form autoComplete="off" style={{width: '100%'}} onSubmit={submitHandler}>
          <TextField onChange={changeHandler} required id="standard-error" label="Noma do curso" style={{width: '100%'}}
                     helperText="Entrada incorreta."/>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Icon>send</Icon>}
            type='submit'
          >
            Send
          </Button>
        </form>
      </Grid>}
      {!!isLoading && <CircularProgress/>}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className='modal'
      >
        <div className='square-content'>
          <h2>{result}</h2>
          <div className='close-modal-icon'>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setModal(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </Modal>

      {!!err && <Snackbar
        open={err}
        autoHideDuration={6000}
        message="Ocorreu um erro, tente novamente!"
        onClose={() => setErr(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setErr(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />}
    </Grid>
  )
}
