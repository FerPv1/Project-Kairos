import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { calendarService } from '../services/calendarService';

const HomeScreen = ({ navigation }) => {
  const [recentEvents, setRecentEvents] = useState([]);
  
  useEffect(() => {
    loadRecentEvents();
  }, []);
  
  const loadRecentEvents = async () => {
    try {
      const events = await calendarService.getEvents();
      // Ordenar eventos por fecha (más recientes primero)
      const sortedEvents = events.sort((a, b) => new Date(b.date) - new Date(a.date));
      // Tomar los 3 eventos más recientes
      setRecentEvents(sortedEvents.slice(0, 3));
    } catch (error) {
      console.error('Error al cargar eventos recientes:', error);
    }
  };

  // Función para manejar la navegación con manejo de errores
  const navigateTo = (screenName) => {
    try {
      console.log(`Intentando navegar a: ${screenName}`);
      navigation.navigate(screenName);
    } catch (error) {
      console.error(`Error al navegar a ${screenName}:`, error);
      // Mostrar alerta al usuario
      Alert.alert(
        'Error de Navegación',
        `No se pudo navegar a ${screenName}. Por favor, intente de nuevo.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3498db" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>kAIros</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigateTo('Profile')}
        >
          <MaterialIcons name="account-circle" size={30} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bienvenido/a</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>
        
        <View style={styles.menuGrid}>
          {/* Tomar Asistencia */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('Attendance')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#3498db' }]}>
              <MaterialIcons name="how-to-reg" size={30} color="white" />
            </View>
            <Text style={styles.menuText}>Tomar Asistencia</Text>
          </TouchableOpacity>
          
          {/* Ver Estudiantes */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('Students')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#2ecc71' }]}>
              <MaterialIcons name="people" size={30} color="white" />
            </View>
            <Text style={styles.menuText}>Estudiantes</Text>
          </TouchableOpacity>
          
          {/* Eventos */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('Events')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#e74c3c' }]}>
              <MaterialIcons name="event" size={30} color="white" />
            </View>
            <Text style={styles.menuText}>Eventos</Text>
          </TouchableOpacity>
          
          {/* Notificaciones */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('Notifications')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#f39c12' }]}>
              <MaterialIcons name="notifications" size={30} color="white" />
            </View>
            <Text style={styles.menuText}>Notificaciones</Text>
          </TouchableOpacity>
          
          {/* Ver Horario */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('Schedule')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#9b59b6' }]}>
              <MaterialIcons name="schedule" size={30} color="white" />
            </View>
            <Text style={styles.menuText}>Ver Horario</Text>
          </TouchableOpacity>
          
          {/* Calificaciones */}
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigateTo('Grades')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#1abc9c' }]}>
              <MaterialIcons name="grade" size={30} color="white" />
            </View>
            <Text style={styles.menuText}>Calificaciones</Text>
          </TouchableOpacity>
        </View>
        
        {/* Sección de eventos recientes - MOVIDA DESPUÉS DE LOS PANELES */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Eventos Recientes</Text>
            <TouchableOpacity onPress={() => navigateTo('Events')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          
          {recentEvents.length > 0 ? (
            recentEvents.map(event => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDateBadge}>
                  <Text style={styles.eventDateText}>{new Date(event.date).getDate()}</Text>
                  <Text style={styles.eventMonthText}>
                    {new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noEventsText}>No hay eventos próximos</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Actualiza los estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  recentSection: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  recentIcon: {
    marginRight: 15,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  recentSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 3,
  },
});

export default HomeScreen;