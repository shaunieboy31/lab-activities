const baseUrl = 'http://localhost:3000'; // adjust if backend uses different host/port

const cityInput = document.getElementById('city');
const goBtn = document.getElementById('go');
const status = document.getElementById('status');
const result = document.getElementById('result');

async function fetchWeather(city){
  if(!city) return showError('Please enter a city.');
  status.textContent = 'Loading...';
  result.textContent = '';
  try {
    const res = await fetch(`${baseUrl}/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText} — ${text}`);
    }
    const data = await res.json();
    status.textContent = 'Success';
    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    showError(err.message || 'Request failed');
  }
}

function showError(msg){
  status.textContent = 'Error';
  result.textContent = msg;
}

goBtn.addEventListener('click', () => fetchWeather(cityInput.value.trim()));
cityInput.addEventListener('keydown', e => { if(e.key === 'Enter') fetchWeather(cityInput.value.trim()); });