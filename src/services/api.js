const API_BASE_URL =
  "https://telegramminiapp-production-5d20.up.railway.app";

  export async function fetchCalendar() {
    const response = await fetch(`${API_BASE_URL}/api/calendar`);

      if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
            }

              return response.json();
              }