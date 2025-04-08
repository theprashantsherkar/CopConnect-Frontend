'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Footer from "@/app/HelpingComponents/Footer";

// Dynamically import MapContainer and its children to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

import "leaflet/dist/leaflet.css";

const TipForm = () => {
  const [location, setLocation] = useState(null);
  const [tip, setTip] = useState("");
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Make sure this code only runs on client
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setMapReady(true);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting tip:", { tip, location });
  };

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

          {location && mapReady && (
            <>
              <p className="text-center mt-4 text-lg">
                Location: {location.latitude}, {location.longitude}
              </p>
              <div className="mt-4">
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
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TipForm;
