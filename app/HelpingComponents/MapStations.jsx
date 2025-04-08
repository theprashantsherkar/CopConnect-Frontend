import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { HiMapPin } from "react-icons/hi";


const MapStations = () => {
  const [location, setLocation] = useState(null);
  const [policeStations, setPoliceStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  // Get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  // Fetch nearby police stations (This would normally be a call to an API)
  useEffect(() => {
    if (location) {
      // Simulated data - replace with actual API call
      setPoliceStations([
        { name: "Police Station 1", lat: location.lat + 0.01, lng: location.lng + 0.01, distance: "1.2 km" },
        { name: "Police Station 2", lat: location.lat + 0.02, lng: location.lng - 0.02, distance: "2.5 km" },
        // More stations...
      ]);
    }
  }, [location]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 text-white border border-blue-400/20 col-span-2">
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/10 p-3 rounded-lg">
              {/* <HiMapPin className="h-6 w-6 text-white" /> */}
            </div>
            <h2 className="text-xl font-semibold">Nearby Resources</h2>
          </div>
          <div className="aspect-video bg-gray-800/50 rounded-lg overflow-hidden relative mb-4">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              {location && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={location}
                  zoom={14}
                >
                  {policeStations.map((station, index) => (
                    <Marker
                      key={index}
                      position={{ lat: station.lat, lng: station.lng }}
                      onClick={() => setSelectedStation(station)}
                    />
                  ))}
                  {selectedStation && (
                    <InfoWindow
                      position={{
                        lat: selectedStation.lat,
                        lng: selectedStation.lng,
                      }}
                      onCloseClick={() => setSelectedStation(null)}
                    >
                      <div>
                        <h3>{selectedStation.name}</h3>
                        <p>{selectedStation.distance}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}
            </LoadScript>
          </div>
        </div>
        <div className="space-y-2">
          {policeStations.map((resource, index) => (
            <div
              key={index}
              className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-blue-300">{resource.type}</span>
                  <p className="text-white font-medium">{resource.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-200">
                    {resource.distance}
                  </span>
                  <p className="text-sm text-blue-200 mt-1">
                    {resource.officers} officers
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapStations;
