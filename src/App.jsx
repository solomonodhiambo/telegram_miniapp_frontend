import { useEffect, useState } from "react";
import { fetchCalendar } from "./services/api";

function App() {
  const [calendar, setCalendar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCalendar() {
      try {
        const data = await fetchCalendar();
        setCalendar(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadCalendar();
  }, []);

  if (error) {
    return <h1>API Error: {error}</h1>;
  }

  if (!calendar) {
    return <h1>Loading calendar...</h1>;
  }

  const firstDate = calendar.dates[0];

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Economic Calendar</h1>
        <p style={styles.subtitle}>EAT (UTC+3)</p>
      </header>

      <main style={styles.container}>
        <h2 style={styles.dateTitle}>
          {firstDate.date}
        </h2>

        {firstDate.events.map((event) => (
          <div
            key={event.id}
            style={styles.eventCard}
          >
            <div style={styles.eventTop}>
              <span style={styles.time}>
                {formatTime(event.scheduledTimestamp)}
              </span>

              <span style={styles.currency}>
                {event.currency.flag}{" "}
                {event.currency.code}
              </span>

              <span
                style={{
                  ...styles.impact,
                  ...getImpactStyle(event.impact),
                }}
              >
                {event.impact}
              </span>
            </div>

            <h3 style={styles.eventTitle}>
              {event.title}
            </h3>

            <div style={styles.values}>
              {event.forecast && (
                <span>
                  Forecast:{" "}
                  {event.forecast.formattedValue}
                </span>
              )}

              {event.previous && (
                <span>
                  Previous:{" "}
                  {event.previous.formattedValue}
                </span>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString(
    "en-KE",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Nairobi",
    }
  );
}

function getImpactStyle(impact) {
  if (impact === "high") {
    return {
      backgroundColor: "#dc2626",
      color: "white",
    };
  }

  if (impact === "medium") {
    return {
      backgroundColor: "#f59e0b",
      color: "white",
    };
  }

  return {
    backgroundColor: "#64748b",
    color: "white",
  };
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily:
      "Arial, sans-serif",
  },

  header: {
    padding: "24px 16px",
    backgroundColor: "#111827",
    borderBottom:
      "1px solid #334155",
  },

  title: {
    margin: 0,
    fontSize: "24px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
  },

  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px 16px",
  },

  dateTitle: {
    fontSize: "20px",
    marginBottom: "16px",
  },

  eventCard: {
    backgroundColor: "#1e293b",
    border:
      "1px solid #334155",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
  },

  eventTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  time: {
    fontWeight: "bold",
    color: "#cbd5e1",
  },

  currency: {
    fontWeight: "bold",
  },

  impact: {
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    textTransform: "uppercase",
  },

  eventTitle: {
    margin:
      "12px 0 10px",
    fontSize: "17px",
  },

  values: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    color: "#94a3b8",
    fontSize: "13px",
  },
};

export default App;
