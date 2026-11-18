// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesButton = document.getElementById('getImagesButton');
const gallery = document.getElementById('gallery');
const nasaApiKey = 'DEMO_KEY';

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

getImagesButton.addEventListener('click', getSpaceImages);

async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    gallery.innerHTML = '<div class="placeholder"><p>Please select both dates.</p></div>';
    return;
  }

  if (startDate > endDate) {
    gallery.innerHTML = '<div class="placeholder"><p>The start date must be before the end date.</p></div>';
    return;
  }

  gallery.innerHTML = '<div class="placeholder"><p>Loading space images...</p></div>';
  getImagesButton.disabled = true;
  getImagesButton.textContent = 'Loading...';

  const url = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API request failed (${response.status})`);
    }

    const data = await response.json();
    displayImages(data);
  } catch (error) {
    gallery.innerHTML = `
      <div class="placeholder">
        <p>Unable to load images. Please try again later.</p>
      </div>
    `;
  } finally {
    getImagesButton.disabled = false;
    getImagesButton.textContent = 'Get Space Images';
  }
}

function displayImages(items) {
  const images = Array.isArray(items) ? items : [items];

  if (images.length === 0) {
    gallery.innerHTML = '<div class="placeholder"><p>No images found for this date range.</p></div>';
    return;
  }

  gallery.innerHTML = images.map((item) => {
    const title = item.title || 'Untitled';
    const date = item.date || '';
    const explanation = item.explanation || 'No description available.';
    const media = item.media_type === 'image'
      ? `<img src="${item.url}" alt="${title}" />`
      : `<a class="media-link" href="${item.url}" target="_blank" rel="noopener noreferrer">View this space media</a>`;

    return `
      <article class="gallery-item">
        ${media}
        <h2>${title}</h2>
        <p><strong>${date}</strong></p>
        <p>${explanation}</p>
      </article>
    `;
  }).join('');
}
