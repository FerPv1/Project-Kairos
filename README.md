kAIrosApp/

├── App.js                  # Punto de entrada principal

├── assets/                 # Imágenes, fuentes, etc.

├── components/             # Componentes reutilizables

│   ├── Calendar.js         # Componente de calendario

│   ├── FaceRecognition.js  # Componente de reconocimiento facial

│   ├── NotificationItem.js # Componente para mostrar notificaciones

│   └── ...

├── navigation/             # Configuración de navegación

│   └── AppNavigator.js     # Navegador principal

├── screens/                # Pantallas principales

│   ├── HomeScreen.js       # Pantalla de bienvenida

│   ├── LoginScreen.js      # Pantalla de inicio de sesión

│   ├── AttendanceScreen.js # Control de asistencia (ya existe)

│   ├── CalendarScreen.js   # Gestión de eventos escolares

│   ├── ScheduleScreen.js   # Horario escolar

│   ├── NotificationsScreen.js # Notificaciones

│   └── ...

└── services/               # Servicios (API, autenticación, etc.)

├── authService.js      # Servicio de autenticación

├── faceRecognitionService.js # Servicio de reconocimiento facial
