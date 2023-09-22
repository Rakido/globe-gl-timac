const markerSvg = `
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="6" fill="#0071B9"/>
</svg>
`;

// Parse data 
const fetchCities = () => {
	return fetch("js/cities.json");
};

async function createGlobe() {
	const res = await fetchCities();
	const data = await res.json();

	const globe = new Globe({
			antialias: true
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

	// Function to create cards called in createGlobe() 
	const createCard = (city, markerSvg) => {
		const card = document.createElement("div");
		card.className = "card";

		// Style marker
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

		// Get image 
		const cardImage = document.createElement("img");
		cardImage.className = "card-image";
		cardImage.src = city.img;
		card.appendChild(cardImage);

		// Body
		const cardBody = document.createElement("div");
		cardBody.className = "card-body";
		card.appendChild(cardBody);

		// Close card
		const closeCard = document.createElement("div");
		closeCard.className = "close-card";
		closeCard.onclick = () => {
			cleanAll();
		};
		cardBody.appendChild(closeCard);

		// Name of the filiales
		const title = document.createElement("h3");
		title.innerText = city.name;
		title.className = "card-title";
		cardBody.appendChild(title);

		// Contact
		const contact = document.createElement("p");
		contact.innerText = city.contact;
		cardBody.appendChild(contact);

		// Factories
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

		// Add link 
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
	globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = -1.3;
	globe.controls().minPolarAngle = 1;
	globe.controls().maxPolarAngle = 2;
	globe.controls().enableZoom = false;

    if ("ontouchstart" in document.documentElement){
        globe.controls().autoRotate = false;
    }

	//set position default of the globe : Zone EU
	globe.pointOfView({
		lat: 40,
		lng: 20,
		altitude: 2
	}, 1500);

	// Filters
	document.getElementById('globefilters').getElementsByClassName('eu')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 40,
			lng: 20,
			altitude: 2
		}, 1000);
	})

	document.getElementById('globefilters').getElementsByClassName('us')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 0,
			lng: -70,
			altitude: 2
		}, 1000);
	})

	document.getElementById('globefilters').getElementsByClassName('as')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 15,
			lng: 100,
			altitude: 2
		}, 1000);
	})

	document.getElementById('globefilters').getElementsByClassName('af')[0].addEventListener('click', (e) => {
		globe.pointOfView({
			lat: 0,
			lng: 20,
			altitude: 2
		}, 1000);
	})

  window.addEventListener('resize', () => {
    onWindowResize();
  }, false);
  
}

createGlobe();

function cleanAll() {
	const markers = document.querySelectorAll('*');
	markers.forEach((element) => {
		element.classList.remove('current-marker');
		element.classList.remove('is-open');
		element.classList.remove('highzindx');
	})
}

function onWindowResize() {
  container = document.getElementById('globe-section').getElementsByClassName('scene-container')[0];  
  container.style.width = window.innerWidth;
  container.style.height = window.innerHeight;
  //createGlobe();
}