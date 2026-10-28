# api_seed.py
import http.client
import json

def seed_with_api():
    print("Connecting directly to the live FastAPI gateway at 127.0.0.1:8000...")
    
    # 1. Open a direct network channel to your running FastAPI instance
    connection = http.client.HTTPConnection("127.0.0.1", 8000)
    headers = {"Content-Type": "application/json"}

    # 2. Let's create our test requests via your POST /requests API route
    sample_tickets = [
        {
            "title": "Server room AC unit leaking water",
            "description": "Water dripping near rack 3B",
            "priority": "HIGH",
            "created_by": 1
        },
        {
            "title": "Main lobby lighting fixture flickering",
            "description": "Fluorescent tube needs replacement",
            "priority": "MEDIUM",
            "created_by": 1
        },
        {
            "title": "Broken desk drawer in HR department",
            "description": "Bottom tracks are bent",
            "priority": "LOW",
            "created_by": 1
        }
    ]

    print("\nSending tickets through your Pydantic validation pipeline...")
    
    for ticket in sample_tickets:
        payload = json.dumps(ticket)
        try:
            connection.request("POST", "/requests", body=payload, headers=headers)
            response = connection.getresponse()
            response_data = response.read().decode()
            
            if response.status in [200, 201]:
                print(f"✅ Success! Created: '{ticket['title']}' (Status: {response.status})")
            else:
                print(f"❌ Backend rejected payload: {response.status} - {response_data}")
                print("💡 Hint: Ensure a user with id=1 exists in your 'users' table before adding tickets.")
        except Exception as e:
            print(f"❌ Failed to reach backend: {e}")

    connection.close()

if __name__ == "__main__":
    seed_with_api()
