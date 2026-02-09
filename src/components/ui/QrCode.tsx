import { useEffect, useState } from "react";

const QrCode = () => {
  const [qr, setQr] = useState(null);
  const [message, setMessage] = useState("Loading QR...");

  useEffect(() => {
    const fetchQr = () => {
      fetch("http://localhost:8000/webhook/qr")
        .then((res) => res.json())
        .then((data) => {
          if (data.qr) {
            setQr(data.qr);
            setMessage("Scan this QR with WhatsApp to log in");
          } else {
            setQr(null);
            setMessage(data.message || "Waiting for QR...");
          }
        })
        .catch(() => {
          setMessage("⚠️ Could not fetch QR");
        });
    };

    // Fetch QR immediately
    fetchQr();

    // Refresh every 10 seconds (WhatsApp QR rotates fast)
    const interval = setInterval(fetchQr, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan WhatsApp QR Code</h2>
      {qr ? (
        <img src={qr} alt="WhatsApp QR Code" style={{ width: "300px" }} />
      ) : (
        <p>✅ WhatsApp is already connected or QR not available</p>
      )}
      <p>Or use this link: https://wa.me/15551446393</p>
    </div>
  );
};

export default QrCode;
