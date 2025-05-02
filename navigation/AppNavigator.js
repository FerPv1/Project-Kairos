import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import StudentsScreen from '../screens/StudentsScreen';
import StudentDetailScreen from '../screens/StudentDetailScreen';
import FaceRecognitionScreen from '../screens/FaceRecognitionScreen';
import StudentGradesScreen from '../screens/StudentGradesScreen';
import GradesScreen from '../screens/GradesScreen'; // Añadir esta importación
import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';

// Crear navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de pestañas principal
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Asistencia') {
            iconName = 'event-available';
          } else if (route.name === 'Estudiantes') {
            iconName = 'people';
          } else if (route.name === 'Calendario') {
            iconName = 'calendar-today';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Asistencia" component={AttendanceScreen} options={{ title: 'Asistencia' }} />
      <Tab.Screen name="Estudiantes" component={StudentsScreen} options={{ title: 'Estudiantes' }} />
      <Tab.Screen name="Calendario" component={CalendarScreen} options={{ title: 'Calendario' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};

// Navegador principal de la aplicación
const AppNavigator = ({ isAuthenticated }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Main" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        {isAuthenticated && (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
            <Stack.Screen 
              name="FaceRecognition" 
              component={FaceRecognitionScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Grades" component={GradesScreen} />
            <Stack.Screen name="StudentGrades" component={StudentGradesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;