// "use client";

// import { useEffect, useState } from "react";

// const IpAddressFetcher = () => {
//   const [ipInfo, setIpInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGeoData = async () => {
//       try {
//         const ipRes = await fetch("https://api.ipify.org?format=json");
//         if (!ipRes.ok) throw new Error("Failed to fetch IP address");
//         const { ip } = await ipRes.json();

//         const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
//         if (!geoRes.ok) throw new Error("Failed to fetch geolocation data");
//         const geoData = await geoRes.json();

//         let address = null;
//         if (geoData.latitude && geoData.longitude) {
//           const revRes = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${geoData.latitude}&lon=${geoData.longitude}`
//           );
//           const revData = await revRes.json();
//           address = revData.display_name;
//         }

//         setIpInfo({ ...geoData, ip, address });
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGeoData();
//   }, []);

//   if (loading) return <p>Loading location info...</p>;
//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <div className="p-4 rounded shadow bg-white max-w-md mx-auto mt-10">
//       <h2 className="text-xl font-semibold mb-2">Your IP Info</h2>
//       <ul className="space-y-1 text-sm">
//         <li>
//           <strong>IP:</strong> {ipInfo.ip}
//         </li>
//         <li>
//           <strong>City:</strong> {ipInfo.city}
//         </li>
//         <li>
//           <strong>Region:</strong> {ipInfo.region}
//         </li>
//         <li>
//           <strong>Country:</strong> {ipInfo.country_name}
//         </li>
//         <li>
//           <strong>Postal:</strong> {ipInfo.postal}
//         </li>
//         <li>
//           <strong>Latitude:</strong> {ipInfo.latitude}
//         </li>
//         <li>
//           <strong>Longitude:</strong> {ipInfo.longitude}
//         </li>
//         <li>
//           <strong>Timezone:</strong> {ipInfo.timezone}
//         </li>
//         <li>
//           <strong>ISP:</strong> {ipInfo.org}
//         </li>
//         {ipInfo.address && (
//           <li>
//             <strong>Approx. Address:</strong> {ipInfo.address}
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default IpAddressFetcher;

"use client";

import { useEffect, useState } from "react";

const IpAddressFetcher = () => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setPosition(coords);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
          );
          const data = await res.json();
          setAddress(data.display_name || "Address not found");
        } catch (err) {
          setAddress("Failed to get address");
        }
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!position) return <p>Getting your exact location...</p>;

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto my-10">
      <h2 className="text-xl font-semibold mb-2">Your Exact Location</h2>
      <ul className="text-sm space-y-1">
        <li>
          <strong>Latitude:</strong> {position.lat}
        </li>
        <li>
          <strong>Longitude:</strong> {position.lng}
        </li>
        <li>
          <strong>Accuracy:</strong> ±{position.accuracy} meters
        </li>
        <li>
          <strong>Address:</strong> {address}
        </li>
      </ul>
    </div>
  );
};

export default IpAddressFetcher;
