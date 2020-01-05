import React, { useEffect, useState } from 'react';
import Timetable from 'react-timetable-events';
import { Redirect } from 'react-router-dom';
import NavBar from '../complement/NavBar';
import Timepicker from '../complement/Timepicker';
import getRooms from '../../functions/getRooms';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import validateTime from '../../functions/validateTime';
import { useQuery } from '@apollo/react-hooks';
import { ROOM_BOOKINGS } from '../../gql/bookings';
import { TimeChooserPanel } from '../ChooseTime/TimeChooserPanel';

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center'
  },
  root: {
    margin: '0'
  }
}));

const makeSelection = (
  timeSlots,
  date,
  start,
  end,
  setStart,
  setEnd,
  doRedirect
) => {
  if (validateTime(timeSlots, date, start, end)) {
    setStart(start);
    setEnd(end);
    doRedirect(true);
  }
};

const doRedirectTask = (room, date, start, end) => {
  return (
    <Redirect
      to={{
        pathname: '/summary',
        state: {
          room,
          date,
          start: moment(start).format('HH:00'),
          end: moment(end).format('HH:00')
        }
      }}
    />
  );
};

function ChooseTime({
  location: {
    state: { room, date }
  }
}) {
  const classes = useStyles();
  const [start, setStart] = useState(
    moment()
      .startOf('hour')
      .toDate()
  );
  const [end, setEnd] = useState(
    moment()
      .startOf('hour')
      .add(1, 'hour')
      .toDate()
  );
  const [redirect, doRedirect] = useState(false);
  const [events, setEvents] = useState();

  const { data } = useQuery(ROOM_BOOKINGS, {
    variables: {
      room
    }
  });

  useEffect(() => {
    if (data) {
      getRooms(data.bookings, date).then(events => {
        setEvents(events);
      });
    }
  }, [room, date, data]);

  if (redirect) {
    return doRedirectTask(room, date, start, end);
  }

  return (
    <>
      <NavBar backPath="/room" />
      <div className={classes.root}>
        <TimeChooserPanel room={room} date={moment(date).format('LL')} />
        <Timepicker
          start={start}
          end={end}
          onContinue={(start, end) =>
            makeSelection(
              events[Object.keys(events)[0]],
              date,
              start,
              end,
              setStart,
              setEnd,
              doRedirect
            )
          }
        />
        {events ? (
          <Timetable events={events} />
        ) : (
          <div>
            <Typography>No events</Typography>
          </div>
        )}
      </div>
    </>
  );
}

export default ChooseTime;