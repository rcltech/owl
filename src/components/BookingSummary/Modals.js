import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Modal, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  modal: {
    position: 'relative',
    bottom: '8vh',
    width: '90vw',
    maxWidth: 'calc(400px + 5vw)',
    maxHeight: '72vh',
    overflow: 'auto',
    margin: 'auto',
    background: 'white',
    borderRadius: '8px',
    padding: theme.spacing(1),
    textAlign: 'center'
  },
  imageContainer: {
    margin: theme.spacing(3)
  },
  image: {
    width: '16vw',
    height: '16vw',
    maxWidth: '120px',
    maxHeight: '120px'
  }
}));

export const Modals = ({ modal, onClick }) => {
  const { isOpen, title, button, image } = modal;
  const classes = useStyles();

  return (
    <Modal open={isOpen} onClose={onClick} className={classes.root}>
      <div className={classes.modal}>
        <Typography variant={'h5'}>{title}</Typography>
        <div className={classes.imageContainer}>
          <img src={image} alt="desc" className={classes.image} />
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={onClick}>
            {button}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
