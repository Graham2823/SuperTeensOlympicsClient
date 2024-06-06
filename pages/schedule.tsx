import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';

interface Event {
	eventDate: string;
	eventID: number;
	eventSport: string; // Type of sport for the event
	eventTeam1: string;
	eventTeam2: string | null;
	eventTime: string;
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

	useEffect(() => {
		try {
			axios
				.get('http://localhost:8000/getSchedule')
				.then((res) => {
					setSchedule(res.data);
					setClearFilter(false);
					setFilteredDate(null);
					setFilteredCommunityCenter(null);
				})
				.catch((e) => {
					console.log(e);
				});
		} catch (e) {
			console.log('error getting community centers:', e);
		}
	}, [clearFilter]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const options = { timeZone: 'UTC' };
		const formattedDate = date.toLocaleDateString('en-US', options);
		return formattedDate;
	};

	const handleFilter = () => {
		if (filteredDate && !filteredCommunityCenter) {
			const formattedDate = filteredDate.toISOString().split('T')[0]; // Extract the date part
			axios
				.get(`http://localhost:8000/eventsByDate/${formattedDate}`)
				.then((res) => {
					setSchedule(res.data);
				})
				.catch((e) => {
					console.log(e);
				});
		} else if (!filteredDate && filteredCommunityCenter) {
			axios
				.get(`http://localhost:8000/eventsBySite/${filteredCommunityCenter}`)
				.then((res) => {
					setSchedule(res.data);
				})
				.catch((e) => {
					console.log(e);
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
				});
		}
	};

	console.log(filteredCommunityCenter);
	console.log(filteredDate);
	console.log(schedule);
	return (
		<div className='schedulePage'>
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
				<button onClick={() => handleFilter()}>Find Events</button>
				<button
					onClick={() => {
						setClearFilter(true);
						setFilteredCommunityCenter(null);
                        setFilteredDate(null) 
					}}>
					Clear Filter
				</button>
			</div>
			<div className='scheduleContainer'>
				{schedule.length > 0 &&
					schedule.map((event, index) => (
						<div className='eventCard' key={index}>
							<h2>{event.eventSport}</h2>
							<h2>
								{formatDate(event.eventDate)} @ {event.eventTime}
							</h2>
							<h2>
								{event.eventTeam1}{' '}
								{event.eventTeam2 ? 'Vs ' + event.eventTeam2 : ''}
							</h2>
						</div>
					))}
			</div>
		</div>
	);
};

export default Schedule;
