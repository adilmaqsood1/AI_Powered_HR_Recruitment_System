# HR Recruitment System - Next.js Frontend

This is the Next.js frontend for the AI-Powered HR Recruitment System. It provides a modern, responsive UI for uploading resumes and analyzing them against job descriptions.

## Features

- Resume upload via drag-and-drop interface
- Job description and title input
- Optional cover letter input
- Resume analysis with match scoring
- Resume strength evaluation
- AI-generated interview questions

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend-next directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

Then start the production server:

```bash
npm run start
# or
yarn start
```

## API Configuration

The frontend is configured to communicate with the FastAPI backend. The API URL is set in `src/services/api.ts`. Update this URL if your backend is deployed to a different location.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- React Dropzone