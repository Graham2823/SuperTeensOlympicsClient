import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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
	'BCYF Roslindale & Ohrenberger',
	'BCYF Tynan',
	'BCYF Vine Street',
];

const Schedule = () => {
	const [schedule, setSchedule] = useState<Event[]>([]);
	const [filteredDate, setFilteredDate] = useState<Date | null>(null);
	const [filteredCommunityCenter, setFilteredCommunityCenter] = useState<string | null>(null);
	const [filteredEventSport, setFilteredEventSport] = useState<string | null>(null);
	const [clearFilter, setClearFilter] = useState<boolean>(false);
	const [showingTodaysEvents, setShowingTodaysEvents] = useState<boolean>(true);
	const { user } = useContext(UserContext);
	const [eventDeleted, setEventDeleted] = useState<boolean>(false);
	const [showOldEvents, setShowOldEvents] = useState<boolean>(false);

	useEffect(() => {
		fetchTodaysEvents();
		setShowingTodaysEvents(true);
	}, [clearFilter, eventDeleted]);

	const fetchEvents = (url: string) => {
		axios
			.get(url)
			.then((res) => {
				setSchedule(res.data);
				setShowingTodaysEvents(false);
			})
			.catch((e) => {
				console.error('Error fetching events:', e);
				toast.error('Could not fetch events. Please try again.');
			});
	};

	const resetFilters = () => {
		setFilteredDate(null);
		setFilteredCommunityCenter(null);
		setFilteredEventSport(null);
		fetchTodaysEvents();
		setClearFilter(true);
		setShowingTodaysEvents(true);
	};

	const handleFilter = () => {
		let url = '';

		if (filteredDate && filteredCommunityCenter && filteredEventSport) {
			const formattedFilteredDate = formatDate(filteredDate.toISOString());
			url = `https://superteensolympicsserver-1.onrender.com/eventsByCenterAndEventAndDate/${filteredCommunityCenter}/${filteredEventSport}/${formattedFilteredDate}`;
		} else if (filteredDate && filteredCommunityCenter) {
			const formattedFilteredDate = formatDate(filteredDate.toISOString());
			url = `https://superteensolympicsserver-1.onrender.com/eventsByDateAndCenter/${formattedFilteredDate}/${filteredCommunityCenter}`;
		} else if (filteredDate && filteredEventSport) {
			const formattedFilteredDate = formatDate(filteredDate.toISOString());
			url = `https://superteensolympicsserver-1.onrender.com/eventsByDateAndEvent/${formattedFilteredDate}/${filteredEventSport}`;
		} else if (filteredCommunityCenter && filteredEventSport) {
			url = `https://superteensolympicsserver-1.onrender.com/eventsByCenterAndEvent/${filteredCommunityCenter}/${filteredEventSport}`;
		} else if (filteredDate) {
			const formattedFilteredDate = formatDate(filteredDate.toISOString());
			url = `https://superteensolympicsserver-1.onrender.com/eventsByDate/${formattedFilteredDate}`;
		} else if (filteredCommunityCenter) {
			url = `https://superteensolympicsserver-1.onrender.com/eventsBySite/${filteredCommunityCenter}`;
		} else if (filteredEventSport) {
			url = `https://superteensolympicsserver-1.onrender.com/eventsByEvent/${filteredEventSport}`;
		}

		if (url) {
			fetchEvents(url);
		}
	};

	const fetchTodaysEvents = () => {
		const currentDate = new Date();
		const formattedDate = currentDate.toISOString().split('T')[0]; // format to yyyy-MM-dd
		axios
			.get(
				`https://superteensolympicsserver-1.onrender.com/eventsByDate/${formattedDate}`
			)
			.then((res) => {
				setSchedule(res.data);
			})
			.catch((e) => {
				console.error('Error fetching events by date:', e);
				toast.error('Could not fetch events for today. Please try again.');
			});
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toISOString().split('T')[0]; // format to yyyy-MM-dd
	};

	const deleteEvent = (eventID: number) => {
		axios
			.delete(
				`https://superteensolympicsserver-1.onrender.com/deleteEvent/${eventID}`
			)
			.then(() => {
				toast.success('Event Deleted Successfully');
				setEventDeleted(true);
			})
			.catch((e) => {
				console.error('Error deleting event:', e);
				toast.error('Could not delete event. Please try again.');
			});
	};

	const getAllEvents = () => {
		axios
			.get('https://superteensolympicsserver-1.onrender.com/getSchedule')
			.then((res) => {
				setSchedule(res.data);
				setShowingTodaysEvents(false);
			})
			.catch((e) => {
				console.error('Error fetching all events:', e);
				toast.error('Could not fetch all events. Please try again.');
			});
	};

	const filteredEvents = schedule.filter((event) => {
		const currentDate = new Date();
		const eventDate = new Date(event.eventDate);
		return showOldEvents || eventDate >= currentDate;
	});

	return (
		<div className='schedulePage'>
			<ToastContainer />
			<h2>SuperTeens Olympics 2024 Schedule</h2>
			<div className='filterEvents'>
				<h4>Filter Events</h4>
				<div className='filterGroup'>
					<label>Filter By Community Center</label>
					{communityCenters.length > 0 && (
						<select
							value={filteredCommunityCenter || ''}
							onChange={(e) => setFilteredCommunityCenter(e.target.value)}>
							<option value=''>All Community Centers</option>
							{communityCenters.map((center, index) => (
								<option key={index} value={center}>
									{center}
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
						placeholderText='Select Date'
						dateFormat='yyyy-MM-dd'
					/>
				</div>
				<div className='filterGroup'>
					<label>Filter By Event Sport</label>
					<select
						value={filteredEventSport || ''}
						onChange={(e) => setFilteredEventSport(e.target.value)}>
						<option value=''>All Events</option>
						<option value='DodgeBall'>DodgeBall</option>
						<option value='KickBall'>KickBall</option>
						<option value='5K'>5K</option>
						<option value='Archery'>Archery</option>
						<option value='Rowing'>Rowing</option>
						<option value='Water Carnival'>Water Carnival</option>
						<option value='Amazing Race'>Amazing Race</option>
					</select>
				</div>
				<button onClick={handleFilter}>Filter Events</button>
				<div className='allEventsContainer'>
					<h4>Or get all events:</h4>
					<button onClick={getAllEvents}>Get All Events</button>
				</div>
				<button onClick={resetFilters}>Clear Filters</button>
			</div>
			<div className='scheduleContainer'>
				<h2>
					{filteredEvents.length === 0 && showingTodaysEvents
						? 'No Events Today'
						 : filteredEvents.length > 0 && showingTodaysEvents
						? 'Todays Events'
						: filteredEvents.length === 0
						? 'No Events Found Given Filtered Settings'
						: 'Events'}
				</h2>
                {!showingTodaysEvents && 
				<button onClick={() => setShowOldEvents((prev) => !prev)} style={{width: "100px", height:'50px',margin:'auto'}}>
					{showOldEvents ? 'Hide' : 'Show'} Old Events
				</button>
                }
				{filteredEvents.map((event, index) => (
					<div className='eventCard' key={index}>
						{user && user.adminID && (
							<FontAwesomeIcon
								icon={faTrash}
								className='deleteIcon'
								onClick={() => deleteEvent(event.eventID)}
							/>
						)}
						<h2>{event.eventSport}</h2>
						<h3>
							{formatDate(event.eventDate)} @ {event.eventTime}
						</h3>
						<h3>
							{event.eventTeam1}{' '}
							{event.eventTeam2 ? 'vs. ' + event.eventTeam2 : ''}
						</h3>
						<h5>Location: {event.eventLocation}</h5>
					</div>
				))}
			</div>
		</div>
	);
};

export default Schedule;
