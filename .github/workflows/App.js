import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { authService } from './services/authService';

// Importar pantallas
import HomeScreen from './screens/HomeScreen';
import StudentsScreen from './screens/StudentsScreen';
import StudentDetailScreen from './screens/StudentDetailScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ProfileScreen from './screens/ProfileScreen';
import EventsScreen from './screens/EventsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import GradesScreen from './screens/GradesScreen';
import StudentGradesScreen from './screens/StudentGradesScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CalendarScreen from './screens/CalendarScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de pestañas principal
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Students') {
            iconName = 'people';
          } else if (route.name === 'Attendance') {
            iconName = 'how-to-reg';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar-today';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Students" component={StudentsScreen} options={{ title: 'Estudiantes' }} />
      <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Asistencia' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendario' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

// Navegador principal de la aplicación
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar si el usuario está autenticado al iniciar la app
    const checkAuth = async () => {
      const auth = await authService.isAuthenticated();
      // Forzar inicio en pantalla de login
      setIsAuthenticated(false);
    };
    
    checkAuth();
    
    // Hacer disponible la función de actualización de autenticación globalmente
    global.updateAuthStatus = (status) => {
      setIsAuthenticated(status);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
            <Stack.Screen name="AddStudent" component={AddStudentScreen} />
            <Stack.Screen name="Events" component={EventsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Grades" component={GradesScreen} />
            <Stack.Screen name="StudentGrades" component={StudentGradesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
