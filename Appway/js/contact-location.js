"use strict";

(function () {
    var blueArea = {
        lat: 33.6844,
        lng: 73.0479,
        label: "Blue Area, Islamabad, Pakistan"
    };

    function toRadians(value) {
        return value * Math.PI / 180;
    }

    function distanceInKm(fromLat, fromLng, toLat, toLng) {
        var earthRadiusKm = 6371;
        var latDistance = toRadians(toLat - fromLat);
        var lngDistance = toRadians(toLng - fromLng);
        var a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
            Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) *
            Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadiusKm * c;
    }

    function setStatus(element, message, statusClass) {
        element.classList.remove("success", "error");
        if (statusClass) {
            element.classList.add(statusClass);
        }
        element.textContent = message;
    }

    function setDirectionsLink(link, origin) {
        var destination = encodeURIComponent(blueArea.label);
        var href = "https://www.google.com/maps/dir/?api=1&destination=" + destination;

        if (origin) {
            href += "&origin=" + encodeURIComponent(origin.lat + "," + origin.lng);
        }

        link.href = href;
    }

    document.addEventListener("DOMContentLoaded", function () {
        var button = document.getElementById("share-location-btn");
        var status = document.getElementById("location-status");
        var directionsLink = document.getElementById("directions-link");

        if (!button || !status || !directionsLink) {
            return;
        }

        setDirectionsLink(directionsLink);

        button.addEventListener("click", function () {
            if (!navigator.geolocation) {
                setStatus(status, "Location sharing is not available in this browser. You can still open directions to Blue Area.", "error");
                return;
            }

            button.disabled = true;
            button.textContent = "Checking location...";
            setStatus(status, "Please confirm the browser prompt so we can estimate your distance from Blue Area.", "");

            navigator.geolocation.getCurrentPosition(function (position) {
                var origin = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                var distance = distanceInKm(origin.lat, origin.lng, blueArea.lat, blueArea.lng);
                var formattedDistance = distance < 1 ? Math.round(distance * 1000) + " meters" : distance.toFixed(1) + " km";

                setDirectionsLink(directionsLink, origin);
                setStatus(status, "Location confirmed. You are approximately " + formattedDistance + " from Blue Area, Islamabad.", "success");
                button.innerHTML = '<i class="fas fa-check"></i> Location Confirmed';
                button.disabled = false;
            }, function () {
                setStatus(status, "Location permission was not shared. You can still open the map and choose your starting point manually.", "error");
                button.innerHTML = '<i class="fas fa-location-arrow"></i> Share Location';
                button.disabled = false;
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            });
        });
    });
})();
