import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RoomIcon from '@material-ui/icons/Room';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import NotesIcon from '@material-ui/icons/Notes';
import { Button, makeStyles } from '@material-ui/core';
import success from '../../images/modals/success.png';
import fail from '../../images/modals/fail.png';
import { useHistory } from 'react-router-dom';
import { NavBar, Loading } from '../complement';
import { Modals } from '../BookingSummary';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  CREATE_BOOKING,
  ROOM_BOOKINGS,
  GET_ALL_BOOKINGS
} from '../../gql/bookings';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { GET_BOOKING_DATE, GET_ROOM_NUMBER } from '../../gql/local/query';

const moment = require('moment');

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
    height: '100vh',
    backgroundColor: theme.palette.primary.light
  },
  list: {
    backgroundColor: 'white'
  },
  buttonContainer: {
    display: 'flex',
    position: 'fixed',
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    padding: '20px',
    width: '100%'
  },
  summaryPaper: {
    margin: 20,
    borderRadius: '20px'
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0
  }
}));

export const BookingSummary = () => {
  const { data: roomData } = useQuery(GET_ROOM_NUMBER);
  const { data: bookingData } = useQuery(GET_BOOKING_DATE);

  const history = useHistory();

  const room = roomData.roomNumber;
  const date = bookingData.bookingDate;
  const start = bookingData.start;
  const end = bookingData.end;

  const classes = useStyles();
  const [modal, setModal] = useState({
    isOpen: false,
    title: undefined,
    button: undefined,
    image: undefined
  });

  const [remark, setRemark] = useState('');

  const [createBooking, { loading, error }] = useMutation(CREATE_BOOKING, {
    refetchQueries: [
      { query: GET_ALL_BOOKINGS },
      { query: ROOM_BOOKINGS, variables: { room } }
    ]
  });

  if (loading) return <Loading />;

  const handleRemarkChange = event => {
    const value = event.target.value;
    if (value.length > 140) return;
    setRemark(event.target.value);
  };

  const handleOnConfirmPress = async () => {
    const startTime = moment(date)
      .hours(Number(moment(start).format('HH')))
      .startOf('hour');
    const endTime = moment(date)
      .hours(Number(moment(end).format('HH')))
      .startOf('hour');
    const booking = {
      room_number: room,
      start: moment(startTime).toISOString(),
      end: moment(endTime).toISOString(),
      remark
    };
    await createBooking({ variables: booking });
    setModal({
      isOpen: true,
      title: !error ? 'Your booking is successful!' : 'An error has occured.',
      button: 'OK',
      image: !error ? success : fail
    });
  };

  const onModalClick = () => {
    history.push('/');
  };

  return (
    <div className={classes.container}>
      <Modals
        modal={modal}
        onClick={() => {
          onModalClick();
        }}
      />
      <NavBar backPath="/room" />
      <Card elevation={3} className={classes.summaryPaper}>
        <CardContent>
          <List className={classes.list}>
            <ListItem>
              <ListItemIcon>
                <RoomIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText>{room}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <EventAvailableIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText>{moment(date).format('LL')}</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText>
                {moment(start).format('hh:mm')} -{' '}
                {moment(end).format('hh:mm a')}
              </ListItemText>
            </ListItem>
            <ListItem className={classes.input}>
              <ListItemIcon>
                <NotesIcon color={'primary'} />
              </ListItemIcon>
              <ListItemText>
                <form noValidate autoComplete="off">
                  <TextField
                    id="remark"
                    label="Optional remark"
                    value={remark}
                    multiline={true}
                    helperText="Maximum number of characters is 140."
                    onChange={handleRemarkChange}
                  />
                </form>
              </ListItemText>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Button
        className={classes.buttonContainer}
        color="primary"
        variant="contained"
        onClick={handleOnConfirmPress}
      >
        Confirm
      </Button>
    </div>
  );
};
