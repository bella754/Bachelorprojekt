//---------------------------
// functions for Home View --
//---------------------------

// directly send data from home screen
export async function send_data() {
    // console.log("in send data function with entries: ", entries.value);
    try {
        const response = await fetch(`/api/send-data/${user.value._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify(entries.value)
        });
        
        const backend_data = await response.json();
        // console.log("Data received:", backend_data);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}