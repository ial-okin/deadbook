from starlette.middleware.cors import CORSMiddleware

def setup_cors(app):
    origins = [
        "http://localhost:5173",  # Frontend development (e.g., React on localhost)
        "",  # Production frontend URL (update this with the actual URL)
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # Allows the specified origins to make requests
        allow_credentials=True,
        allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],  # Allows all headers
    )