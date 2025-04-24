import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Datos de ejemplo para eventos
const DEMO_EVENTS = [
  {
    id: '1',
    title: 'Reunión de padres',
    date: '2023-11-15',
    time: '15:00',
    description: 'Reunión general con padres de familia para discutir el progreso académico.'
  },
  {
    id: '2',
    title: 'Día del Maestro',
    date: '2023-11-20',
    time: '10:00',
    description: 'Celebración del día del maestro con actividades especiales.'
  },
  {
    id: '3',
    title: 'Feria de Ciencias',
    date: '2023-11-25',
    time: '09:00',
    description: 'Presentación de proyectos científicos de los estudiantes.'
  }
];

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    // Aquí podrías cargar eventos desde una API o servicio
    setEvents(DEMO_EVENTS);
  }, []);
  
  const renderEventItem = ({ item }) => {
    // Convertir fecha a formato legible
    const eventDate = new Date(item.date);
    const formattedDate = eventDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <TouchableOpacity style={styles.eventItem}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <MaterialIcons name="event" size={24} color="#3498db" />
        </View>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <MaterialIcons name="calendar-today" size={16} color="#7f8c8d" style={styles.detailIcon} />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.eventDetail}>
            <MaterialIcons name="access-time" size={16} color="#7f8c8d" style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription}>{item.description}</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eventos</Text>
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay eventos programados</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    padding: 5,
  },
  listContent: {
    padding: 15,
  },
  eventItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  eventDetails: {
    marginBottom: 10,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    marginRight: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  eventDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
});

export default EventsScreen;