document.getElementById('captureBtn').addEventListener('click', () => {
    const cameraInput = document.getElementById('cameraInput');
    cameraInput.click();
});

document.getElementById('cameraInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = document.getElementById('photo');
        img.src = URL.createObjectURL(file);

        // Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('location').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;

                    // Fetch address using OpenStreetMap Nominatim API
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.address) {
                                const address = [
                                    data.address.road,
                                    data.address.suburb,
                                    data.address.city,
                                    data.address.state,
                                    data.address.country
                                ].filter(Boolean).join(', ');

                                document.getElementById('location').innerText = `Location: ${address}`;
                            } else {
                                document.getElementById('location').innerText = 'No address found for this location.';
                            }

                            // Show and configure the "Open in Google Maps" button
                            const openMapBtn = document.getElementById('openMapBtn');
                            openMapBtn.style.display = 'block';
                            openMapBtn.onclick = () => {
                                window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
                            };
                        })
                        .catch(error => {
                            document.getElementById('location').innerText = `Error fetching address: ${error.message}`;
                        });
                },
                error => {
                    document.getElementById('location').innerText = `Error getting location: ${error.message}`;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            document.getElementById('location').innerText = 'Geolocation is not supported by this browser.';
        }
    }
});
