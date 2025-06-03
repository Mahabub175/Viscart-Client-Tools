"use client";

import { useEffect, useState } from "react";

const IpAddressFetcher = () => {
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        if (!ipRes.ok) throw new Error("Failed to fetch IP address");
        const { ip } = await ipRes.json();

        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!geoRes.ok) throw new Error("Failed to fetch geolocation data");
        const geoData = await geoRes.json();

        setIpInfo({ ...geoData, ip });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  if (loading) return <p>Loading location info...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 rounded shadow bg-white max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-2">Your IP Info</h2>
      <ul className="space-y-1 text-sm">
        <li>
          <strong>IP:</strong> {ipInfo.ip}
        </li>
        <li>
          <strong>City:</strong> {ipInfo.city}
        </li>
        <li>
          <strong>Region:</strong> {ipInfo.region}
        </li>
        <li>
          <strong>Country:</strong> {ipInfo.country_name}
        </li>
        <li>
          <strong>Postal:</strong> {ipInfo.postal}
        </li>
        <li>
          <strong>Latitude:</strong> {ipInfo.latitude}
        </li>
        <li>
          <strong>Longitude:</strong> {ipInfo.longitude}
        </li>
        <li>
          <strong>Timezone:</strong> {ipInfo.timezone}
        </li>
        <li>
          <strong>ISP:</strong> {ipInfo.org}
        </li>
      </ul>
    </div>
  );
};

export default IpAddressFetcher;
