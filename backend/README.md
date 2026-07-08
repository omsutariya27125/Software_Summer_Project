Create a `.env` file in this `backend` folder:

```env
SECRET_KEY=change-this-secret
url=your-mongodb-connection-string
```

Install the backend dependencies:

```bash
python -m pip install -r requirements.txt
```

Run from the `backend` folder:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Run from the project root:

```bash
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Use `--host 0.0.0.0` only when you want another device on your network to access the server.
