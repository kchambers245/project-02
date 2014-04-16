'use strict';
 
(function () {
    var apikey = 'RkT0lwr1raI9r4rL',
        eventsUrl = 'http://api.songkick.com/api/3.0/metro_areas/4125/calendar.json',
        setupEvents,
        getEvents,
        parseEvents,
        displayEvents,
        map,
        LeafIcon,
        grayIcon;
 
	setupEvents = function setupEventsF() {
		map = L.map('map').setView([39.293067, -76.610198], 14);

        L.tileLayer('http://{s}.tile.cloudmade.com/38ecb759110046cd823f7fe9b32f0a0e/90168/256/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        LeafIcon = L.Icon.extend({
            options: {
                
                iconSize:     [15, 15],
                shadowSize:   [0, 0],
                iconAnchor:   [8, 8], // point of the icon which will correspond to marker's location
                shadowAnchor: [0, 0],
                popupAnchor:  [1, -14] // point from which the popup should open relative to the iconAnchor
            }
        });

        grayIcon = new LeafIcon({iconUrl: 'img/marker2.png'});
	};
	
	
	displayEvents = function displayEventsF(events) {
		var i,
			count = events.length;
			
		for (i=0; i < count; i++) {
			var event = events[i],
				performanceCount = event.performances.length,
				j,
				performanceList = [],
				eventDate,
				eventTime;
				
			
			
			if (event.lat != null) {				
				for (j=0; j < performanceCount; j++) {
					var performance = event.performances[j]; // performance is shortcut to individual performance
					var details,
						detail = [],
						eventDate = performance.start.date;
						eventTime = performance.start.time;
						
					console.log(performance);

                    detail.push('<p class="start-date">' + eventDate + '</p>');
                    detail.push('<p class="start-time">' + eventTime + '</p>');
					detail.push('<h3>' + performance.displayName + '</h3>');

					
					details = '<li class="peformance">' + detail.join('') + '</li>';
					
					performanceList.push(details);
				}
			
			
			
				L.marker([event.lat, event.lng], {icon: grayIcon})
					.addTo(map)
					.bindPopup('<h1>' + event.displayName + '</h1><ul class="performance-list">' + performanceList.join('') + '</ul>');
			}
		}
		
		
	};   
    
    parseEvents = function parseEventsF(data) {
        var events = data.resultsPage.results.event, // events is the alias for all events
            groupedEvents = [],
            venues = {},
            item,
            i,
            count = events.length,
            cur;
            
 
        for (i=0; i < count; i++) {
            cur = events[i];
 
            // checks if venue id is in venues object
            if(!(cur.venue.id in venues)) {
                venues[cur.venue.id] = {
                    id: cur.venue.id,
                    displayName: cur.venue.displayName,
                    lat: cur.venue.lat,
                    lng: cur.venue.lng,
                    performances: []
                };
                groupedEvents.push(venues[cur.venue.id]);
            }
            venues[cur.venue.id].performances.push(cur);
        }
 
        displayEvents(groupedEvents);
    };
 
    getEvents = function getEventsF() {
        var req;
 
        req = $.ajax({
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            url: eventsUrl,
            data: {
                apikey: apikey
            }
        });
 
        req.done(parseEvents);
    };
 
	setupEvents();
    getEvents();
   
})();
