# Persona Discussion Panel

## Running the Frontend

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies (choose one):
   ```sh
   npm install
   # or
   pnpm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The app will be available at http://localhost:3000 by default.

---

**Note:**
- `requirements.txt` is present only for compatibility with some tools. All actual dependencies are managed via `package.json`.
- This project uses Node.js and Next.js, not Python.

## Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install backend requirements:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn backend.main:app --reload
   ```

The server will be available at http://127.0.0.1:8000

## Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the Next.js development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000