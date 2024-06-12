import React, { useState, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import TimePicker from 'react-bootstrap-time-picker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';


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

const CreateEvent = () => {
	const [eventSport, setEventSport] = useState<string>('');
	const [eventDate, setEventDate] = useState<Date | null>(null);
	const [eventTime, setEventTime] = useState<string>('10:00 AM');
	const [eventLocation, setEventLocation] = useState<string>('');
	const [eventCommunityCenter1ID, setEventCommunityCenter1ID] = useState<string>('BCYF Blackstone');
	const [eventCommunityCenter2ID, setEventCommunityCenter2ID] =
		useState<string>('BCYF Blackstone');
	const router = useRouter()
	const {user} = useContext(UserContext)

	const handleCreateEvent = () => {
		try {
			
				const eventObject = {
					eventSport: eventSport,
					eventDate: eventDate,
					eventTime: eventTime,
					eventLocation: eventLocation,
					eventCommunityCenter1ID: eventCommunityCenter1ID,
					eventCommunityCenter2ID: eventCommunityCenter2ID,
				};
				if (eventObject) {
					axios
						.post(`http://localhost:8000/createEvent`, eventObject)
						.then((response) => {
							console.log(response.data);
							toast.success("event Successfully created")
							setEventSport('')
							setEventDate(null)
							setEventTime('10:00 AM')
							setEventLocation('')
							setEventCommunityCenter1ID("BCYF Blackstone")
							setEventCommunityCenter2ID("BCYF Blackstone")
						})
						.catch((error) => {
							console.error('Error fetching data:', error);
							console.error(
								'Complete error object:',
								error.response ? error.response.data : error
							);
							toast.error("Failed to create event. Try again!")
						});
					}
				} catch (e) {
			toast.error("Failed to create event. Try again!")
			console.log(e);
		}
	};

	const handleStartTimeChange = (selectedTime: any) => {
		const hours = Math.floor(selectedTime / 3600); // Convert seconds to hours
		const minutes = Math.floor((selectedTime % 3600) / 60); // Convert remaining seconds to minutes
		const formattedTime = formatTime(hours, minutes);
		console.log(formattedTime);
		setEventTime(formattedTime);
	};

	// Function to format time into "HH:MM AM/PM" format
	const formatTime = (hours: any, minutes: any) => {
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHours = hours % 12 || 12; // Convert 0 to 12
		const formattedMinutes = minutes.toString().padStart(2, '0'); // Add leading zero if needed
		return `${formattedHours}:${formattedMinutes} ${ampm}`;
	};
	return (
		<div>
		  {user && user.data.adminID ? (
			<>
			  <ToastContainer />
			  <div className='eventForm'>
				<h4>Create an event</h4>
				<div className='eventFormGroup'>
				  <label>Event Sport</label>
				  <input
					type='text'
					value={eventSport}
					onChange={(e) => setEventSport(e.target.value)}
				  />
				</div>
				<div className='eventFormGroup'>
				  <label>Event Date</label>
				  <DatePicker
					selected={eventDate}
					onChange={(date: Date) => setEventDate(date)}
					placeholderText='Date'
					dateFormat='yyyy-MM-dd'
				  />
				</div>
				<div className='eventFormGroup'>
				  <label>Time</label>
				  <TimePicker
					start='10:00'
					end='21:00'
					step={30}
					value={eventTime}
					onChange={handleStartTimeChange}
				  />
				</div>
				<div className='eventFormGroup'>
				  <label>Event Location</label>
				  <input
					type='text'
					value={eventLocation}
					onChange={(e) => setEventLocation(e.target.value)}
				  />
				</div>
				<div className='eventFormGroup'>
				  <label>Community Center 1</label>
				  <select onChange={(e) => setEventCommunityCenter1ID(e.target.value)}>
					{communityCenters.length > 0 &&
					  communityCenters.map((center, index) => (
						<option key={index} value={center}>
						  {center}
						</option>
					  ))}
				  </select>
				</div>
				<div className='eventFormGroup'>
				  <label>Community Center 2</label>
				  <select onChange={(e) => setEventCommunityCenter2ID(e.target.value)}>
					{communityCenters.length > 0 &&
					  communityCenters.map((center, index) => (
						<option key={index} value={center}>
						  {center}
						</option>
					  ))}
				  </select>
				</div>
				<button onClick={() => handleCreateEvent()}>Create Event</button>
			  </div>
			</>
		  ) : (
			<h2 style={{textAlign:'center'}}>You Do Not Have Access To This Page. Return to Home Page!</h2>
		  )}
		</div>
	  );
	  
};

export default CreateEvent;
