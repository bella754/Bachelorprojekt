//---------------------------
// functions for Home View --
//---------------------------

// directly send data from home screen
export async function send_data() {
    console.log("in home send data function with data: ", data);
    try {
        const response = await fetch('/api/send-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const backned_data = await response.json();
        console.log("Data received:", backned_data);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

// data request from office administrator to other employees
export async function get_data() {
    // console.log("in send_data func");
    try {
        const response = await fetch('/api/request-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        const backend_data = await response.json();
        console.log("Data received:", backend_data);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}
