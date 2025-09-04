# ExamEye - AI-Powered Online Examination Platform

<div align="center">
  <img src="frontend/public/logo.png" alt="ExamEye Logo" width="200"/>
  
  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)
</div>

## 🎯 Overview

ExamEye is a comprehensive online examination platform that combines traditional testing with AI-powered proctoring and coding assessments. Built with modern web technologies, it provides a secure and efficient environment for conducting remote examinations with real-time cheating detection.

## ✨ Key Features

### 🔒 AI-Powered Proctoring
- **Real-time Face Detection**: Monitors student presence during exams
- **Multiple Face Detection**: Detects if multiple people are present
- **Object Detection**: Identifies prohibited items like cell phones
- **Auto-submission**: Automatically submits exams after 10 violations
- **Screenshot Capture**: Records violations with timestamps

### 📝 Dual Assessment System
- **Multiple Choice Questions (MCQ)**: Traditional question-answer format
- **Coding Challenges**: Programming questions with live code execution
- **Multi-language Support**: Python, JavaScript, and Java
- **Live Code Testing**: Real-time code compilation and execution

### 👨‍🏫 Teacher Dashboard
- **Exam Creation**: Create and manage multiple exams
- **Question Management**: Add MCQ and coding questions
- **Result Analytics**: View detailed student performance
- **Cheating Reports**: Monitor and review violation logs
- **Submission Tracking**: Track all student submissions

### 👨‍🎓 Student Interface
- **Intuitive Exam Interface**: Clean and focused exam environment
- **Progress Tracking**: Real-time progress indicators
- **Code Editor**: Monaco editor with syntax highlighting
- **Timer Management**: Individual timers for coding questions
- **Mobile Responsive**: Works on all device sizes

## 🛠️ Technology Stack

### Frontend
- **React 18.x** - Modern UI library
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **Monaco Editor** - Code editor
- **TensorFlow.js** - AI/ML for object detection
- **Chart.js** - Data visualization
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### AI/ML Libraries
- **@tensorflow/tfjs** - Machine learning framework
- **@tensorflow-models/coco-ssd** - Object detection model

### Deployment
- **Vercel** - Cloud platform for deployment
- **MongoDB Atlas** - Cloud database

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gulshan36/ExamEyes.git
   cd ExamEye
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Run the Application**
   
   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## 📁 Project Structure

```
ExamEye/
├── backend/
│   ├── controllers/           # Route controllers
│   │   ├── examController.js
│   │   ├── userController.js
│   │   ├── codingController.js
│   │   └── cheatingLogController.js
│   ├── models/               # Database models
│   │   ├── examModel.js
│   │   ├── userModel.js
│   │   ├── quesModel.js
│   │   └── cheatingLogModel.js
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── config/              # Database configuration
│   └── server.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/          # Page components
│   │   │   ├── student/    # Student interfaces
│   │   │   ├── teacher/    # Teacher interfaces
│   │   │   └── authentication/
│   │   ├── slices/         # Redux slices
│   │   ├── context/        # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── layouts/        # Page layouts
│   └── public/             # Static assets
└── README.md
```

## 🔑 Core Features Explained

### Proctoring System
The AI-powered proctoring system uses TensorFlow.js and COCO-SSD model to:
- Monitor student's face presence
- Detect multiple faces in the camera view
- Identify prohibited objects (phones, books, etc.)
- Capture screenshots of violations
- Implement graduated warning system (warnings at 5 violations, auto-submit at 10)

### Coding Assessment
- Support for multiple programming languages
- Real-time code execution and testing
- Individual timers for each coding question
- Code persistence across question navigation
- Automatic submission on timer expiry

### Security Features
- JWT-based authentication
- Role-based access control (Student/Teacher)
- Session management
- CORS protection
- Input validation and sanitization

## 📊 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/logout` - User logout

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create new exam
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams/submit` - Submit exam answers

### Coding
- `GET /api/coding/questions/exam/:examId` - Get coding questions
- `POST /api/coding/submit` - Submit coding solution
- `POST /api/coding/questions` - Create coding question

### Cheating Logs
- `POST /api/cheating-logs` - Save cheating log
- `GET /api/cheating-logs/:examId` - Get cheating logs for exam

## 🎮 User Roles

### Students
- Take MCQ and coding exams
- View exam results
- Track progress and performance
- Access exam history

### Teachers
- Create and manage exams
- Add questions (MCQ and coding)
- Monitor student performance
- Review cheating reports
- Analyze exam statistics

## 🔧 Configuration

### Frontend Configuration
- API base URL configuration in `src/slices/apiSlice.js`
- Theme configuration in `src/theme/`
- Routing setup in `src/routes/Router.jsx`

### Backend Configuration
- Database connection in `config/db.js`
- CORS settings in `server.js`
- Environment variables in `.env`

## 🚀 Deployment

### Vercel Deployment

1. **Backend Deployment**
   ```bash
   # Deploy backend to Vercel
   cd backend
   vercel --prod
   ```

2. **Frontend Deployment**
   ```bash
   # Deploy frontend to Vercel
   cd frontend
   vercel --prod
   ```

3. **Environment Variables**
   Set the following in Vercel dashboard:
   - `MONGO_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Live Demo
- **Frontend**: [https://exam-eyes-faif.vercel.app](https://exam-eyes-faif.vercel.app)
- **Backend**: [https://exam-eyes.vercel.app](https://exam-eyes.vercel.app)

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test
```

## 📱 Browser Support

- Chrome (Recommended)
- Firefox
- Safari
- Edge

*Note: Camera and microphone access required for proctoring features*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Camera permissions must be granted for proctoring to work
- Some browsers may require HTTPS for camera access
- Large code submissions may take time to process

## 🔮 Future Enhancements

- [ ] Voice detection for additional proctoring
- [ ] Plagiarism detection for coding submissions
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Integration with LMS platforms
- [ ] Automated question generation
- [ ] Video recording of exam sessions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gulshan Kumar**
- GitHub: [@Gulshan36](https://github.com/Gulshan36)
- Email: your.email@example.com

## 🙏 Acknowledgments

- TensorFlow.js team for the object detection models
- Material-UI team for the excellent component library
- MongoDB team for the robust database solution
- Vercel team for seamless deployment platform

## 📞 Support

For support, email your.email@example.com or create an issue in this repository.

---

<div align="center">
  Made with ❤️ by Gulshan Kumar
</div>
