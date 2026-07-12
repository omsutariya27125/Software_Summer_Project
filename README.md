# AI-Powered Smart Learning Portal for JEE Main Mathematics

## Project Overview
The AI-Powered Smart Learning Portal is a web-based platform designed to help JEE Main aspirants improve their Mathematics preparation through chapter-wise practice, progress tracking, and personalized learning support.

The project initially focuses on Mathematics due to its structured syllabus, extensive question bank, and suitability for AI-driven question generation and evaluation. This focused approach enables the development of a high-quality learning experience while establishing a strong foundation for future expansion into Physics and Chemistry.

Future enhancements will include adaptive learning, AI-powered doubt solving, personalized study recommendations, and advanced performance analytics.


Create a `.env` file in the `backend` folder:

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
