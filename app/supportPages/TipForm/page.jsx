'use client'
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import Footer from "@/app/HelpingComponents/Footer";

const TipForm = () => {
  const [location, setLocation] = useState(null);
  const [tip, setTip] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);  // Track map loading

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(() => {
        setMapLoaded(true); // Set map as loaded once Leaflet is available
      });
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting tip:", { tip, location });
  };

  if (!mapLoaded) return <p className="text-center text-lg text-blue-400">Loading map...</p>;

  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-gray-800 border-b border-blue-800">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-400">Submit an Anonymous Tip</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            placeholder="Describe the incident..."
            className="w-full h-36 p-4 mb-4 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Submit Tip
          </button>
        </form>
        {location && (
          <>
            <p className="text-center mt-4 text-lg">
              Location: {location.latitude}, {location.longitude}
            </p>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={17}
              style={{ height: "300px", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>Your location</Popup>
              </Marker>
            </MapContainer>
          </>
        )}
      </div>

      {/* Footer */}
      
    </div>
    <Footer />
    </>
  );
};

export default TipForm;
