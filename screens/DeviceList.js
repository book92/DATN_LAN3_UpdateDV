import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const DeviceList = () => {
  const route = useRoute();
  const { chartData } = route.params;
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const firestore = getFirestore();
        let q = collection(firestore, 'DEVICES');

        switch (chartData.type) {
          case 'Error':
            q = query(q, where('deviceName', '==', chartData.deviceName));
            break;
          case 'User':
            q = query(q, where('department', '==', chartData.department));
            break;
          case 'Device':
            if (chartData.department) {
              q = query(q, where('departmentName', '==', chartData.department));
            } else if (chartData.user) {
              q = query(q, where('user', '==', chartData.user));
            }
            break;
          default:
            // No additional filter
            break;
        }

        const querySnapshot = await getDocs(q);
        const devicesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDevices(devicesData);
      } catch (error) {
        console.error("Error fetching devices: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [chartData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getFilterDescription = () => {
    switch (chartData.type) {
      case 'Error':
        return `Devices with name ${chartData.deviceName}`;
      case 'User':
        return `Users in ${chartData.department}`;
      case 'Device':
        return chartData.department 
          ? `Devices in ${chartData.department}`
          : `Devices for user ${chartData.user}`;
      default:
        return 'All devices';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getFilterDescription()}</Text>
      <Text style={styles.subtitle}>Total: {devices.length}</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name || item.deviceName}</Text>
            <Text>Status: {item.status}</Text>
            <Text>User: {item.user}</Text>
            <Text>Department: {item.departmentName}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default DeviceList;
