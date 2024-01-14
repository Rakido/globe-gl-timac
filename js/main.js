// Define marker SVG
const markerSvg = `
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="6" fill="#0071B9"/>
</svg>
`;

function cleanAll() {
	const markers = document.querySelectorAll('*');
	markers.forEach((element) => {
		element.classList.remove('current-marker');
		element.classList.remove('is-open');
		element.classList.remove('highindex');
	})
}

// Function to fetch city data
const fetchCities = () => {
	return fetch("js/cities.json");
};

// Main function to create the globe
async function createGlobe() {
	// Fetch city data
	const res = await fetchCities();
	const data = await res.json();

	// Initialize the Globe
	const globe = Globe({
			antialias: false,
			precision: 'lowp'
		})
		.globeImageUrl('img/mapworld.jpg')
		.htmlElementsData(data.cities)
		.backgroundColor('#F5F5F5')
		.atmosphereColor('#D9D5D7')
		.htmlElement(city => {
			const card = createCard(city, markerSvg);
			return card;
		})
		(document.getElementById('globe-section'));
		
	// Function to create a card for a city
	const createCard = (city, markerSvg) => {
		const card = document.createElement("div");
		card.className = "card";

		// Create marker
		const marker = document.createElement('div');
		marker.classList.add('marker');
		marker.innerHTML = markerSvg;

		// Open and close cards
		marker.addEventListener('click', () => {
			cleanAll();
			marker.classList.add('current-marker');
			const markerContent = marker.parentNode.querySelector('.card-body');
			markerContent.classList.add('is-open');
			const card = marker.parentNode;
			card.classList.add('highzindx');
		})
		card.appendChild(marker);

		// Create and add image
		const cardImage = document.createElement("img");
		cardImage.className = "card-image";
		cardImage.src = city.img;
		cardImage.loading = 'lazy';
		card.appendChild(cardImage);

		// Create card body
		const cardBody = document.createElement("div");
		cardBody.className = "card-body";
		card.appendChild(cardBody);

		// Handle closing card
		const closeCard = document.createElement("div");
		closeCard.className = "close-card";
		closeCard.onclick = () => {
			cleanAll();
		};
		cardBody.appendChild(closeCard);

		// Name of each site
		const title = document.createElement("h3");
		title.innerText = city.name;
		title.className = "card-title";
		cardBody.appendChild(title);

		// Contact of each site
		const contact = document.createElement("p");
		contact.innerText = city.contact;
		cardBody.appendChild(contact);

		// Add factories
		const cardInfos = document.createElement("span");
		cardInfos.className = "card-factories";

		// Handle pluralize or hide if no factory
		if (city.units === 0) {
			cardInfos.style.display = "none";
		} else if (city.units === 1) {
			cardInfos.innerText = `${city.units} unité de productions`;
		} else {
			cardInfos.innerText = `${city.units} unités de productions`;
		}

		// Add link to website 
		let cta = document.createElement('a');
		cta.innerText = "Visiter le site web";
		cta.href = city.website;
		cta.target = '_blank';
		cta.classList.add('card-cta');

		// Add all that informations to the cards
		cardBody.append(cardImage, title, contact, cardInfos, cta, closeCard);
		card.append(cardBody);

		return card;
	}

  // setup globe controls
	globe.controls().minPolarAngle = 1;
	globe.controls().maxPolarAngle = 2;
	globe.controls().enableZoom = false;
	globe.controls().autoRotate = false;

	globe.renderer().setPixelRatio(window.devicePixelRatio * 0.6)
	globe.renderer().antialias = true
	

	if ("ontouchstart" in document.documentElement){
			globe.controls().autoRotate = false;
	}

	//set position default of the globe : Zone EU
	globe.pointOfView({
		lat: 40,
		lng: 20,
		altitude: 2
	}, 1500);

	// Scope camera To EU
	document.getElementById('globefilters').getElementsByClassName('eu')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 40,
			lng: 20,
			altitude: 2
		}, 1000);
	})

	// Scope camera  To US
	document.getElementById('globefilters').getElementsByClassName('us')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 0,
			lng: -70,
			altitude: 2
		}, 1000);
	})

	// Scope camera  To ASIA
	document.getElementById('globefilters').getElementsByClassName('as')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 15,
			lng: 100,
			altitude: 2
		}, 1000);
	})

	// Scope camera  To AFRICA
	document.getElementById('globefilters').getElementsByClassName('af')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 0,
			lng: 20,
			altitude: 2
		}, 1000);
	})

  //window.addEventListener('resize', debounce(onWindowResize, 250), false); 
	window.addEventListener('resize', onWindowResize, 250, false); 
}

createGlobe();

// Optimize responsive CPU
function debounce(func, wait, immediate) {
	let timeout;
	return function() {
			const context = this, args = arguments;
			const later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
			};
			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
	};
}

// Handle resize
function onWindowResize() {
	const container = document.getElementById('globe-section').getElementsByClassName('scene-container')[0];
  container.style.width = window.innerWidth;
  container.style.height = window.innerHeight;
  createGlobe();
}