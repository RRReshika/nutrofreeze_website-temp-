
  # Recreate Brars Website

  This is a code bundle for Recreate Brars Website. The original project is available at https://www.figma.com/design/PzDYcUsSmfkLi54rL4k3r4/Recreate-Brars-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    ## Connect frontend to backend

    1. Install backend dependencies:
      - `cd app/api`
      - `npm i`

    2. Start the backend API:
      - `npm run dev`
      - API runs on `http://localhost:3001`

    3. In a second terminal, start the frontend:
      - `cd ../..`
      - `npm run dev`
      - Frontend runs on `http://localhost:5173`

    The frontend now loads products from the backend endpoint `GET /catalog/products` via the Vite proxy (`/api`).

    Optional for deployed environments:
    - Set frontend env `VITE_API_BASE_URL` to your API URL (example: `https://api.yourdomain.com`).
    - Set backend env `CORS_ORIGINS` as a comma-separated list of allowed frontend origins.
  