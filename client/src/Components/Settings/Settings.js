import { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

// Own Components:
import Line from './Line';
import FavoriteList from './FavoriteList';
import BackgroundChanging from './BackgroundChanging';
import Popup from '../Popup/Popup';

// Setting Sections:
import ElementVisibility from './SettingSections/ElementVisibility';
import ClockSettings from './SettingSections/ClockSettings';
import GreetingModifier from './SettingSections/GreetingModifier';
import AddingNewFavorite from './SettingSections/AddingNewFavorite';
import ExportingImporting from './SettingSections/ExportingImporting';

import './style/Settings.css';

const Settings = ({
	// variables from localStorage
	showElements,
	greeting,
	favoritesArray,
	backgroundColor,
	
	// getter functions:
	getFavorites,
	getGreetingPronouns,
	getGreetingEmoji,
	getShowSeconds,
	getTwentyFourClockMode,
}) => {
	// element visibility variables
	const [ showCalendar, setShowCalendar ] = useState(
		showElements.calendar !== null ? showElements.calendar : true
	);
	const [ showFavorites, setShowFavorites ] = useState(
		showElements.favorites !== null ? showElements.favorites : true
	);
	const [ showGreeting, setShowGreeting ] = useState(
		showElements.greeting !== null ? showElements.greeting : true
	);
	const [ showNotifications, setShowNotifications ] = useState(
		showElements.notifications !== null ? showElements.notifications : true
	);

	// variables for clock settings
	const [ showSeconds, setShowSeconds ] = useState(
		showElements.seconds !== null ? showElements.seconds : true
	);
	const [ twentyFourClockMode, setTwentyFourClockMode ] = useState(
		showElements.twentyFourClockMode !== null ? showElements.twentyFourClockMode : false
	);

	// greeting
	const [ greetingPronouns, setGreetingPronouns ] = useState(greeting.pronouns || 'friend');
	const [ greetingEmoji, setGreetingEmoji ] = useState(greeting.emoji || '🐣');

	const [ favorites, setFavorites ] = useState(favoritesArray);

	const [popup, setPopup] = useState(Object);

	// on the page load it blocks those animatinos where its displaying is disabled
	useEffect(() => {
		const favorites = document.querySelector('.favorites');
		const calendar = document.querySelector('.react-calendar-container');
		const greeting = document.querySelector('.greeting');
		const notifications = document.querySelector('.event-notifications-container');

		if (!favorites.classList.contains('favorites-hidden')) {
			favorites.style.display = 'none';
		}
		if (!calendar.classList.contains('react-calendar-hidden')) {
			calendar.style.display = 'none';
		}
		if (!greeting.classList.contains('greeting-hidden')) {
			greeting.style.display = 'none';
		}
		if (!notifications.classList.contains('event-notifications-container-hidden')) {
			notifications.style.display = 'none';
		}
	}, []);

	// showFavorites changes => animation changes (useing animationHandler function)
	useEffect(() => {
		animationHandler('favorites', 'favorites-hidden', 'flex', showFavorites);
	}, [ showFavorites ]);

	// showGreeting changes => animation chagnges...
	useEffect(() => {
		const greeting = document.querySelector('.greeting');

		if (showGreeting) {
			greeting.style.display = 'block';
			if (greeting.classList.contains('greeting-hidden')) {
				greeting.classList.add('greeting-shown');
			}
			greeting.classList.remove('greeting-hidden');
		} else {
			greeting.classList.remove('greeting-shown');
			greeting.classList.add('greeting-hidden');
		}
	}, [ showGreeting ]);

	// calendar displaying
	useEffect(() => {
		bottomComponentsAnimationHandler('react-calendar-container', 'react-calendar-hidden', showCalendar, 600);
	}, [ showCalendar ]);

	// notification panel displaying
	useEffect(() => {
		bottomComponentsAnimationHandler('event-notifications-container', 'event-notifications-container-hidden', showNotifications, 600);
	}, [showNotifications]);
	
	// getFavorites if it changes
	useEffect(() => {
		if (getFavorites) {
			return getFavorites(favorites);
		}
		return;
	}, [favorites, getFavorites]);

	// getGreetingPronouns if it changes
	useEffect(() => {
		if (getGreetingPronouns) {
			return getGreetingPronouns(greetingPronouns);
		}
		return;
	}, [greetingPronouns, getGreetingPronouns]);

	// returns greetingEmoji if it's changing
	useEffect(() => {
		if (getGreetingEmoji) {
			return getGreetingEmoji(greetingEmoji);
		}
		return;
	}, [greetingEmoji, getGreetingEmoji]);
	
	// returns showSeconds if it's changing
	useEffect(() => {
		if (getShowSeconds) {
			return getShowSeconds(showSeconds);
		}
		return;
	}, [showSeconds, getShowSeconds]);

	// returns twentyFourClockMode if it's changing
	useEffect(() => {
		if (getTwentyFourClockMode) {
			return getTwentyFourClockMode(twentyFourClockMode);
		}
		return;
	}, [twentyFourClockMode, getTwentyFourClockMode]);

	/**
	 * it gets four parameters there is two names of css classes, one of them is the main class
	 * and the other is the hidden class (what hides the given element by an animation) if the fourth
	 * parameter what is the condition is true then it removes the hidden class and set the display
	 * for the specified value otherwise it adds only the hidden class (here the display part is not changing)
	 */
	const animationHandler = (mainClass, hiddenClass, display, condition) => {
		const element = document.querySelector(`.${mainClass}`);
		if (condition) {
			element.style.display = display;
			element.classList.remove(hiddenClass);
		} else {
			element.classList.add(hiddenClass);
		}
	}

	/**
	 * Here by this function name I mean the calendar and notification components
	 * and this function only take care of those. Here you can specify a delay for
	 * the end of the animation. (Btw it is really similar to the animationHandler function)
	 */
	const bottomComponentsAnimationHandler = (mainClass, hiddenClass, condition, delay) => {
		const element = document.querySelector(`.${mainClass}`);
		if (condition) {
			element.style.display = null;
			element.classList.remove(hiddenClass);
		} else {
			element.classList.add(hiddenClass);
			setTimeout(() => {
				element.style.display = 'none';
			}, delay);
		}
	}

	const saveChanges = (event) => {
		if (event) {
			event.preventDefault();
		}

		const bgColor = document.querySelector('body').style.backgroundImage
			.replace('linear-gradient(rgb(', '')
			.replace('), rgb(164, 164, 164))', '')
			.split(', ');
		
		const datas = {
			showElements: {
				calendar: showCalendar,
				favorites: showFavorites,
				greeting: showGreeting,
				notifications: showNotifications,
				seconds: showSeconds,
				twentyFourClockMode,
			},
			greeting: {
				pronouns: greetingPronouns,
				emoji: greetingEmoji,
			},
			favoritesArray: favorites,
			backgroundColor: {
				R: parseInt(bgColor[0]),
				G: parseInt(bgColor[1]),
				B: parseInt(bgColor[2]),
			}
		}

		greeting.pronouns = greetingPronouns;
		greeting.emoji = greetingEmoji;

		localStorage.setItem('datas', JSON.stringify(datas));
		createNotification('Success', 'Changes have been saved!', 'success');
	}

	/*
	 * It is a template or pattern for the imported addNotification to be easier to use it
	 * and by this you don't have to specify so many properties every time.
	 */
	const createNotification = (title, message, type) => {
		store.addNotification({
			title, message, type,
			container: 'bottom-center',
			animationIn: ['animate__animated animate__flipInX'],
			animationOut: ['animate__animated animate__fadeOut'],
			dismiss: {
				duration: 3000
			}
		});
	}
	
	return (
		<>
			<ReactNotifications />
			<Popup
				type={popup.type}
				open={popup.open}
				datas={popup.datas}
			/>
			<div className='settings'>
				<h1>Settings</h1>
				<Line />
				<form className='settings-form' onSubmit={ saveChanges }>

					<ElementVisibility
						showFavorites={showFavorites} setShowFavorites={setShowFavorites}
						showGreeting={showGreeting} setShowGreeting={setShowGreeting}
						showCalendar={showCalendar} setShowCalendar={setShowCalendar}
						showNotifications={showNotifications} setShowNotifications={setShowNotifications}
					/>

					<Line />

					<ClockSettings
						twentyFourClockMode={twentyFourClockMode}
						setTwentyFourClockMode={setTwentyFourClockMode}
						showSeconds={showSeconds}
						setShowSeconds={setShowSeconds}
					/>

					<Line />

					<BackgroundChanging
						R={ backgroundColor.R }
						G={ backgroundColor.G }
						B={ backgroundColor.B }
					/>

					<Line />

					<GreetingModifier
						showGreeting={showGreeting}
						setGreetingPronouns={setGreetingPronouns}
						setGreetingEmoji={setGreetingEmoji}
						createNotification={createNotification}
					/>

					<Line />

					<AddingNewFavorite
						favorites={favorites}
						setFavorites={setFavorites}
						createNotification={createNotification}
					/>

					<Line />

					<FavoriteList
						favorites={favorites}
						setFavorites={setFavorites}
						setPopup={setPopup}
						saveChanges={saveChanges}
						createNotification={createNotification}
					/>

					<Line />

					<ExportingImporting
						createNotification={createNotification}
						setPopup={setPopup}
					/>

					{/* Save changes */}
					<div className='save-changes'>
						<Button
							type='submit'
							variant='contained'
							color='primary'
						>Save</Button>
					</div>

				</form>
				<Line />
			</div>
		</>
	)
}

export default Settings;