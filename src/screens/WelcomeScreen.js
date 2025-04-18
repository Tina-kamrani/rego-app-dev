import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import IconButton from '../components/IconButton';
import menu_data from '@/src/data/menu';
import { AuthContext } from '@/app/authContext';
import { useContext, useState, useEffect } from 'react';
import { addMenuType, fetchMenuTypes } from '@/database/MenuType';
import i18n from '../core/i18n';

export default function HomeScreen({navigation}) {
    const { userdata } = useContext(AuthContext);
    const [menuTypes, setMenuTypes] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const existingMenuTypes = await fetchMenuTypes();
        let updatedMenuTypes = existingMenuTypes;
    
        for (let element of menu_data) {
          const exists = existingMenuTypes.some(menuType => menuType.name === element.title);
    
          if (!exists) {
            updatedMenuTypes = await addMenuType({
              name: element.title,
              icon: element.icon,
              status: true,
            });
          }
        }
        
        const menuData = await fetchMenuTypes();
        setMenuTypes(menuData);
      };
  
      fetchData();
    }, []);

    let menus = menuTypes.map((element, index) => {
      return (
        element.status ? 
        <IconButton 
          key={index}
          iconName={element.icon}
          title={element.name}
          onPress={() => navigation.navigate('ReportScreen', { iconName: element.icon, title: element.name })}
        /> :
        null
      );
    });
  
    return (
      <ParallaxScrollView
        headerTitle={'Welcome' + userdata.userName + '!'}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{i18n.t('welcome')}</ThemedText>
        </ThemedView>
        <View style={styles.grid}>
          {menus}
        </View>
      </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  }
});
