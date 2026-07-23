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

  return (
    <div>
      <h1>Calendar API Connected</h1>

      <p>
        Dates received: {calendar.dates?.length ?? 0}
      </p>

      <p>
        API timezone: {calendar.timezone?.name}
      </p>

      <pre>
        {JSON.stringify(calendar.dates?.[0], null, 2)}
      </pre>
    </div>
  );
}

export default App;
