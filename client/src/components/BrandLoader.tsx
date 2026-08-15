import { useEffect, useState } from "react";

export default function BrandLoader() {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    const ticker = window.setInterval(() => setProgress(value => Math.min(value + 16, 92)), 130);
    return () => window.clearInterval(ticker);
  }, []);

  return <div className="brand-loader" role="status" aria-live="polite" aria-label="Loading portfolio">
    <div className="loader-mark" aria-hidden="true"><i /><i /><i /><svg viewBox="0 0 80 80"><path d="M14 52 30 24l10 18 12-18 14 28" /></svg></div>
    <div className="loader-copy"><strong>Loading</strong><span>Preparing the system / جاري التحميل</span></div>
    <div className="loader-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
  </div>;
}
