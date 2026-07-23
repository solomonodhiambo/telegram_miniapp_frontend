import { useEffect, useState } from "react";
import { fetchCalendar } from "./services/api";

function App() {
  const [calendar, setCalendar] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [impactFilter, setImpactFilter] = useState("all");
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

  const dates = calendar.dates;
  const selectedDate = dates[selectedDateIndex];

  const filteredEvents =
    impactFilter === "all"
      ? selectedDate.events
      : selectedDate.events.filter(
          (event) => event.impact === impactFilter
        );

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Economic Calendar</h1>
        <p style={styles.subtitle}>EAT (UTC+3)</p>
      </header>

      <main style={styles.container}>
        <div style={styles.navigation}>
          <button
            style={styles.navButton}
            disabled={selectedDateIndex === 0}
            onClick={() =>
              setSelectedDateIndex(
                selectedDateIndex - 1
              )
            }
          >
            ← Previous
          </button>

          <button
            style={styles.todayButton}
            onClick={() => setSelectedDateIndex(0)}
          >
            Today
          </button>

          <button
            style={styles.navButton}
            disabled={
              selectedDateIndex ===
              dates.length - 1
            }
            onClick={() =>
              setSelectedDateIndex(
                selectedDateIndex + 1
              )
            }
          >
            Next →
          </button>
        </div>

        <h2 style={styles.dateTitle}>
          {formatDate(selectedDate.date)}
        </h2>

        <div style={styles.filterContainer}>
          {["all", "high", "medium", "low"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() =>
                  setImpactFilter(filter)
                }
                style={{
                  ...styles.filterButton,
                  ...(impactFilter === filter
                    ? styles.activeFilter
                    : {}),
                }}
              >
                {filter}
              </button>
            )
          )}
        </div>

        <p style={styles.eventCount}>
          Showing {filteredEvents.length} of{" "}
          {selectedDate.events.length} events
        </p>

        {filteredEvents.length === 0 ? (
          <div style={styles.emptyState}>
            No {impactFilter} impact events
            scheduled for this day.
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              style={styles.eventCard}
            >
              <div style={styles.eventTop}>
                <span style={styles.time}>
                  {formatTime(
                    event.scheduledTimestamp
                  )}
                </span>

                <span style={styles.currency}>
                  {event.currency.flag}{" "}
                  {event.currency.code}
                </span>

                <span
                  style={{
                    ...styles.impact,
                    ...getImpactStyle(
                      event.impact
                    ),
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
                    {
                      event.forecast
                        .formattedValue
                    }
                  </span>
                )}

                {event.previous && (
                  <span>
                    Previous:{" "}
                    {
                      event.previous
                        .formattedValue
                    }
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString("en-KE", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
    fontFamily: "Arial, sans-serif",
  },

  header: {
    padding: "24px 16px",
    backgroundColor: "#111827",
    borderBottom: "1px solid #334155",
    textAlign: "center",
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

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "20px",
  },

  navButton: {
    flex: 1,
    padding: "10px 8px",
    borderRadius: "8px",
    border: "1px solid #475569",
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    cursor: "pointer",
  },

  todayButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  dateTitle: {
    fontSize: "20px",
    marginBottom: "16px",
    textAlign: "center",
  },

  filterContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },

  filterButton: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "1px solid #475569",
    backgroundColor: "#1e293b",
    color: "#cbd5e1",
    cursor: "pointer",
    textTransform: "capitalize",
  },

  activeFilter: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "1px solid #2563eb",
  },

  eventCount: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "14px",
  },

  emptyState: {
    padding: "30px 20px",
    textAlign: "center",
    color: "#94a3b8",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
  },

  eventCard: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
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
    margin: "12px 0 10px",
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
