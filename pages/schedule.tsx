import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '@/context/userContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Event {
    eventDate: string;
    eventID: number;
    eventSport: string; // Type of sport for the event
    eventTeam1: string;
    eventTeam2: string | null;
    eventTime: string;
    eventLocation: string;
    eventWinner: string | null;
}

const communityCenters = [
    'BCYF Blackstone',
    'BCYF Condon',
    'BCYF Curtis Hall',
    'BCYF Gallivan',
    'BCYF Hennigan',
    'BCYF Holland',
    'BCYF Hyde Park',
    'BCYF Leahy Holloran',
    'BCYF Marshall',
    'BCYF Mattahunt',
    'BCYF Menino',
    'BCYF Paris Street',
    'BCYF Perkins',
    'BCYF Pino',
    'BCYF Roche',
    'BCYF Roslindale/Ohrenberger',
    'BCYF Tynan',
    'BCYF Vine Street',
];

const Schedule = () => {
    const [schedule, setSchedule] = useState<Event[]>([]);
    const [filteredDate, setFilteredDate] = useState<Date | null>(null);
    const [filteredCommunityCenter, setFilteredCommunityCenter] = useState<
        string | null
    >(null);
    const [clearFilter, setClearFilter] = useState<boolean>(false);
    const {user} = useContext(UserContext)
    const [eventDeleted, setEventDeleted] = useState<boolean>(false)
    // Get the current date
    const currentDate = new Date();
    // Extract year, month, and day from the current date
    const year = currentDate.getFullYear();
    // January is 0, so we add 1 to get the correct month
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    // Format the date in the desired format (year/month/day)
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const [showingTodaysEvents, setShowingTodaysEvents] = useState<boolean>(true)
    const [showingCommunityCentersEvents, setShowingCommunityCentersEvents]= useState<boolean>(false)
    const [showingEventsByDate, setShowingEventsByDate]= useState<boolean>(false)
    const [showingAllEvents, setShowingAllEvents] = useState<boolean>(false)
    const [formattedFilteredDate, setFormattedFilteredDate] = useState<string>('')
    console.log('date', formattedDate)

    useEffect(() => {
        try {
            if(formattedDate){
                axios
                    .get(`http://localhost:8000/eventsByDate/${formattedDate}`)
                    .then((res) => {
                        setSchedule(res.data);
                        setClearFilter(false);
                        setFilteredDate(null);
                        setFilteredCommunityCenter(null);
                        setEventDeleted(false)
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        } catch (e) {
            console.log('error getting community centers:', e);
        }
    }, [clearFilter, eventDeleted]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options = { timeZone: 'UTC' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const handleFilter = () => {
        setShowingTodaysEvents(false)
        if (filteredDate && !filteredCommunityCenter) {
            const formattedDate = filteredDate.toISOString().split('T')[0]; // Extract the date part
            setFormattedFilteredDate(formattedDate)
            axios
                .get(`http://localhost:8000/eventsByDate/${formattedDate}`)
                .then((res) => {
                    setSchedule(res.data);
                    setShowingEventsByDate(true)
                    setShowingAllEvents(false)
                    setShowingCommunityCentersEvents(false)
                })
                .catch((e) => {
                    console.log(e);
                    toast.error("Could not filter. try Again!")
                });
        } else if (!filteredDate && filteredCommunityCenter) {
            axios
                .get(`http://localhost:8000/eventsBySite/${filteredCommunityCenter}`)
                .then((res) => {
                    setSchedule(res.data);
                    setShowingCommunityCentersEvents(true)
                    setShowingAllEvents(false)
                    setShowingEventsByDate(false)
                })
                .catch((e) => {
                    console.log(e);
                    toast.error("Could not filter. try Again!")
                });
        } else if (filteredDate && filteredCommunityCenter) {
            const formattedDate = filteredDate.toISOString().split('T')[0];
            console.log(formattedDate);
            axios
                .get(
                    `http://localhost:8000/eventsByDateAndCenter/${formattedDate}/${filteredCommunityCenter}`
                )
                .then((res) => {
                    setSchedule(res.data);
                })
                .catch((e) => {
                    console.log(e);
                    toast.error("Could not filter. try Again!")
                });
        }
    };
    
    const deleteEvent = (eventID: number) =>{
        axios
                .delete(`http://localhost:8000/deleteEvent/${eventID}`)
                .then((res) => {
                    toast.success("Event Deleted")
                    setEventDeleted(true)
                })
                .catch((e) => {
                    console.log(e);
                    toast.error("Could Not Delete Event. Try Again!")
                });
    }

    const getAllEvents = () =>{
        axios
                .get(`http://localhost:8000/getSchedule`)
                .then((res) => {
                    setSchedule(res.data);
                    setShowingAllEvents(true)
                    setShowingCommunityCentersEvents(false)
                    setShowingEventsByDate(false)
                    setShowingTodaysEvents(false)
                })
                .catch((e) => {
                    console.log(e);
                    toast.error("Could not filter. try Again!")
                });
    }


    return (
        <div className='schedulePage'>
            <ToastContainer/>
            <h2>SuperTeens Olympics 2024 Schedule</h2>
            <div className='filterEvents'>
                <h4>Filter Events</h4>
                <div className='filterGroup'>
                    <label>Filter By Community Center</label>
                    {communityCenters.length > 0 && (
                        <select
                            value={filteredCommunityCenter || ''}
                            onChange={(e) => setFilteredCommunityCenter(e.target.value)}>
                            <option>Community Center</option>
                            {communityCenters.map((team, index) => (
                                <option key={index} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div className='filterGroup'>
                    <label>Filter By Event Date</label>
                    <DatePicker
                        selected={filteredDate}
                        onChange={(date: Date) => setFilteredDate(date)}
                        placeholderText='Date'
                        dateFormat='yyyy-MM-dd'
                    />
                </div>
                <button onClick={() => handleFilter()}>Filter Events</button>
                <button
                    onClick={() => {
                        setClearFilter(true);
                        setFilteredCommunityCenter(null);
                        setFilteredDate(null);
                        setShowingCommunityCentersEvents(false)
                        setShowingEventsByDate(false)
                        setShowingTodaysEvents(true)
                        setShowingAllEvents(false)
                    }}>
                    Clear Filter
                </button>
                        <button onClick={()=> getAllEvents()}>Get All Events</button>
            </div>
            <div className='scheduleContainer'>
                {showingTodaysEvents ?(
                    <h2>Todays Events:</h2>
                ): showingCommunityCentersEvents ?(
                    <h2>{filteredCommunityCenter} Events</h2>
                ): showingEventsByDate ?(
                    <h2>Events on {formatDate(formattedFilteredDate)}</h2>
                ): showingAllEvents ?(
                    <h2>All Events</h2>
                ):(
                    <h2></h2>
                )
                }
                {schedule.length > 0 ?(
                    schedule.map((event, index) => (
                        <div className='eventCard' key={index}>
                            {user && user.data.adminID && 
                            <FontAwesomeIcon icon={faTrash} className='deleteIcon' onClick={()=>deleteEvent(event.eventID)}/>
                            }
                            <h2>{event.eventSport}</h2>
                            <h3>
                                {formatDate(event.eventDate)} @ {event.eventTime}
                            </h3>
                            <h3>
                                {event.eventTeam1}{' '}
                                {event.eventTeam2 ? 'Vs ' + event.eventTeam2 : ''}
                            </h3>
                            <h5>Location: {event.eventLocation}</h5>
                        </div>
                    ))
                ):(
                    <h2>{showingTodaysEvents ? "No Events Today" : showingEventsByDate ? `No Events on ${formatDate(formattedFilteredDate)}` : showingCommunityCentersEvents ? `${filteredCommunityCenter} has no events Scheduled` : ''}</h2>
                )
                    }
            </div>
        </div>
    );
};

export default Schedule;