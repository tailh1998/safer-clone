# AI Task Manager

A web-based application that allows users to manage tasks using AI. Users can input task requests, generate detailed task drafts using AI, and store them in a database.

![AI Task Manager Screenshot](/public/placeholder.png)

## 📦 Features

- **AI-Powered Task Creation**: Generate detailed task drafts from simple requests
- **Task Management Dashboard**: View, search, and manage all your submitted tasks
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme
- **Local Storage**: Tasks are stored in your browser's local storage

## 🚕 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Components**: React with shadcn/ui
- **Styling**: Tailwind CSS
- **AI Integration**: Google AI with GeminiAI (with fallback simulation)
- **State Management**: React hooks
- **Data Storage**: Browser localStorage with simulated API calls

## ▶️ Getting Started

### 💼 Prerequisites

- Please use the Node version specified in the `.nvmrc` file.
- Node.js `v20.17.0` or later
- yarn `v1.22.21`

### 💾 Installation

- Clone the repository:

```bash
git clone https://github.com/tailh1998/5s3s-task-manager.git
cd 5s3s-task-manager
```

- Install dependencies:

```bash
yarn install
# or
yarn
```

- Start the development server:

```bash
yarn dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Creating a Task

1. Navigate to the "Create Task" page
2. Enter your task request in the text area
3. Click "Generate Draft" to let AI create a detailed task
4. Review the generated draft in the preview section
5. Click "Submit Task Draft" to save the task

### Viewing Tasks

1. Navigate to the "Dashboard" page
2. Browse all submitted tasks in the table
3. Use the search box to filter tasks
4. Click "View" on any task to see full details

## Project Structure

```.
ai-task-manager/
├── app/                                # Next.js App Router
│   ├── create/                         # Task creation page
│   ├── dashboard/                      # Task dashboard page
│   ├── globals.css                     # Global styles
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home page
├── components/                         # React components
│   ├── header.tsx                      # Application header
│   ├── mode-toggle.tsx                 # Theme toggle
│   ├── task-draft-preview.tsx          # Task draft preview
│   └── task-table.tsx                  # Task table component
├── lib/                                # Utility functions and services
│   ├── ai-service.ts                   # AI integration service
│   ├── task-service.ts                 # Task data service
│   ├── types.ts                        # TypeScript types
│   └── utils.ts                        # Utility functions
└── public/                             # Static assets
```

## Customization

### Adding Real Gemini Integration

To use real Gemini integration instead of the simulated responses:

1. Sign up for a Gemini API key at [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Add your API key to the environment variables:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Extending Functionality

The application is designed to be easily extendable. Some ideas for extensions:

- Add task categories and filtering
- Implement task priority levels
- Add due dates and reminders
- Create task templates
- Add user authentication
- Implement real database storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Gemini Integration](https://makersuite.google.com/app/apikey) - AI integration
