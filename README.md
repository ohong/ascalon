# Ascalon - Writing Progress Tracker

A social platform for writers to track and share their daily writing achievements.

## Features

### Current Features
1. **Word Count Tracking**
   - Simple form to log daily word counts
   - Optional descriptions for each entry
   - Immediate submission and feedback

2. **Writing Streak Visualization**
   - GitHub-style contribution graph
   - Year-long writing history
   - Color-coded activity levels:
     * Light green: < 500 words
     * Medium green: 500-999 words
     * Dark green: 1000-1999 words
     * Very dark green: 2000+ words

3. **Progress Statistics**
   - Total words written
   - Number of writing days
   - Current writing streak
   - Longest writing streak

4. **Writing History**
   - Chronological list of entries
   - Date and word count for each entry
   - Optional descriptions displayed

### Planned Features
1. User Authentication
2. Supabase Database Integration
3. Social Sharing Features
4. Writing Goals and Achievements
5. Advanced Analytics
6. Data Export/Import
7. Writing Session Timer
8. Platform Integrations

## Technology Stack

### Frontend
- Framework: Vite + React
- Language: TypeScript
- Styling: Tailwind CSS
- Key Dependencies:
  * react-calendar-heatmap
  * date-fns
  * @vitejs/plugin-react

### Backend
- Framework: FastAPI (Python)
- Current Storage: Local JSON
- Planned Database: Supabase (PostgreSQL)
- Key Dependencies:
  * fastapi
  * uvicorn
  * python-decouple

## Getting Started

### Prerequisites
- Node.js v23.2.0
- Python 3.x
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ascalon
```

2. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Development Status

### Completed
- Basic project structure
- Word count entry system
- Writing streak visualization
- Progress statistics
- Local data storage

### In Progress
- Database integration
- User authentication
- Social features

### Future Plans
1. Set up Supabase project
2. Implement user profiles
3. Add social interaction features
4. Enhance writing analytics
5. Add data export functionality

## Contributing

This project is currently in development. Feel free to submit issues and pull requests.

## License

[License Type] - See LICENSE file for details
