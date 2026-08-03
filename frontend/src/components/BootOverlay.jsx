import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../api.js';
import './BootOverlay.scss';

const POLL_INTERVAL_MS = 3000;

const BootOverlay = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId;

    const checkHealth = async () => {
      try {
        await axios.get(`${API_ENDPOINT}health`);
        if (!cancelled) {
          setReady(true);
          if (intervalId) clearInterval(intervalId);
        }
      } catch {
        // Server still cold or unreachable — keep polling
      }
    };

    checkHealth();
    intervalId = setInterval(checkHealth, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  if (ready) return null;

  return (
    <div className="boot-overlay" role="dialog" aria-modal="true" aria-labelledby="boot-overlay-title">
      <div className="boot-overlay__panel">
        <div className="boot-overlay__spinner" aria-hidden="true" />
        <h2 id="boot-overlay-title">Waking up the server…</h2>
        <p>Free-tier hosts can take a moment to start. This page will unlock automatically.</p>
      </div>
    </div>
  );
};

export default BootOverlay;
