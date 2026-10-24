# Facility-HelpDesk-Copilot
This is my project which gonna solve the real world problem .So this repository is about  how i worked on this project from stratch to end 


## Run locally
1. python -m venv venv, then activate it
2. pip install -r requirements.txt
3. Copy .env.example to .env and set your database URL
4. Run the SQL in data/schema.sql and data/sample_data.sql
5. uvicorn app.main:app --reload --port 8001
6. Open http://127.0.0.1:8001/docs