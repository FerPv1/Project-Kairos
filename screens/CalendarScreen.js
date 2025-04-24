import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  Alert 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_STORAGE_KEY = 'calendar_events';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '12:00',
    date: new Date().toISOString().split('T')[0]
  });
  const [markedDates, setMarkedDates] = useState({});

  // Cargar eventos al iniciar
  useEffect(() => {
    loadEvents();
  }, []);

  // Filtrar eventos cuando cambia la fecha seleccionada
  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(event => event.date === selectedDate);
      setFilteredEvents(filtered);
    }
  }, [selectedDate, events]);

  // Actualizar fechas marcadas cuando cambian los eventos
  useEffect(() => {
    const marked = {};
    events.forEach(event => {
      marked[event.date] = { 
        marked: true, 
        dotColor: '#3498db',
        selected: event.date === selectedDate,
        selectedColor: event.date === selectedDate ? '#3498db' : undefined
      };
    });
    
    // Asegurarse de que la fecha seleccionada siempre esté marcada
    if (!marked[selectedDate]) {
      marked[selectedDate] = { 
        selected: true, 
        selectedColor: '#3498db' 
      };
    }
    
    setMarkedDates(marked);
  }, [events, selectedDate]);

  // Cargar eventos desde AsyncStorage
  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      Alert.alert('Error', 'No se pudieron cargar los eventos');
    }
  };

  // Guardar eventos en AsyncStorage
  const saveEvents = async (updatedEvents) => {
    try {
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error al guardar eventos:', error);
      throw error;
    }
  };

  // Agregar nuevo evento
  const handleAddEvent = async () => {
    if (!newEvent.title) {
      Alert.alert('Error', 'Por favor ingresa un título para el evento');
      return;
    }

    try {
      const eventToAdd = {
        id: Date.now().toString(),
        ...newEvent,
        date: selectedDate
      };

      const updatedEvents = [...events, eventToAdd];
      await saveEvents(updatedEvents);
      setEvents(updatedEvents);
      setModalVisible(false);
      setNewEvent({
        title: '',
        description: '',
        time: '12:00',
        date: selectedDate
      });
      
      Alert.alert('Éxito', 'Evento agregado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el evento');
    }
  };

  // Eliminar evento
  const handleDeleteEvent = async (eventId) => {
    try {
      const updatedEvents = events.filter(event => event.id !== eventId);
      await saveEvents(updatedEvents);
      setEvents(updatedEvents);
      Alert.alert('Éxito', 'Evento eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el evento');
    }
  };

  // Renderizar item de evento
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
        {item.description ? (
          <Text style={styles.eventDescription}>{item.description}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            'Eliminar Evento',
            '¿Estás seguro de que deseas eliminar este evento?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', onPress: () => handleDeleteEvent(item.id) }
            ]
          );
        }}
      >
        <MaterialIcons name="delete" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendario Escolar</Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#3498db',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3498db',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#3498db',
          selectedDotColor: '#ffffff',
          arrowColor: '#3498db',
          monthTextColor: '#2d4150',
          indicatorColor: '#3498db',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
      />

      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>Eventos para {selectedDate}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay eventos para esta fecha</Text>
          </View>
        )}
      </View>
      
      {/* Modal para agregar evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Evento</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título del evento"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({...newEvent, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Hora (HH:MM)"
              value={newEvent.time}
              onChangeText={(text) => setNewEvent({...newEvent, time: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({...newEvent, description: text})}
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddEvent}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  eventsContainer: {
    flex: 1,
    padding: 10,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  eventTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#2c3e50',
    marginTop: 5,
  },
  deleteButton: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;