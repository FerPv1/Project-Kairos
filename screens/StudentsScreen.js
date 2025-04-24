import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SectionList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { studentService } from '../services/studentService';

const StudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadStudents();
    });

    // Cargar estudiantes al montar el componente
    loadStudents();

    return unsubscribe;
  }, [navigation]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await studentService.getStudents();
      console.log('Estudiantes cargados:', studentsData.length);
      setStudents(studentsData);
      
      // Organizar estudiantes por nivel y sección
      organizeStudentsBySections(studentsData);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeStudentsBySections = (studentsData) => {
    // Separar estudiantes por nivel
    const inicialStudents = studentsData.filter(s => s.level === 'inicial');
    const primariaStudents = studentsData.filter(s => s.level === 'primaria');
    
    // Organizar nivel inicial por secciones
    const inicialSections = ['I', 'II', 'III'];
    const inicialSectionsData = inicialSections.map(section => {
      return {
        title: `Inicial - Sección ${section}`,
        data: inicialStudents.filter(s => s.section === section)
      };
    }).filter(section => section.data.length > 0);
    
    // Organizar nivel primaria por grados
    const primariaSections = ['1', '2', '3', '4', '5', '6'];
    const primariaSectionsData = primariaSections.map(grade => {
      return {
        title: `${grade}° Grado de Primaria`,
        data: primariaStudents.filter(s => s.section === grade)
      };
    }).filter(section => section.data.length > 0);
    
    // Combinar todas las secciones
    setSections([...inicialSectionsData, ...primariaSectionsData]);
  };

  const filteredSections = () => {
    if (!searchQuery) return sections;
    
    return sections.map(section => {
      return {
        title: section.title,
        data: section.data.filter(student => 
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };
    }).filter(section => section.data.length > 0);
  };

  const renderStudentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.studentItem}
      onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })}
    >
      <View style={styles.studentAvatar}>
        <Text style={styles.avatarText}>{item.firstName.charAt(0)}</Text>
      </View>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.studentCode}>{item.studentCode}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#bdc3c7" />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estudiantes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddStudent')}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar estudiante..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={24} color="#7f8c8d" />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Cargando estudiantes...</Text>
        </View>
      ) : (
        <SectionList
          sections={filteredSections()}
          keyExtractor={(item) => item.id}
          renderItem={renderStudentItem}
          renderSectionHeader={renderSectionHeader}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron estudiantes</Text>
            </View>
          }
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#3498db',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentCode: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

export default StudentsScreen;