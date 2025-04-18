import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Divider, List, Menu, TextInput, Text } from 'react-native-paper';
import Option from './Option';

const SelectInput = ({ 
  data, 
  disabled, 
  valueExtractor, 
  labelExtractor, 
  onChangeText, 
  placeholder, 
  style, 
  value 
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [width, setWidth] = useState(350);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const onPress = () => {
    setSelected(selectedIndex());
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const selectedIndex = () => {
    return data.findIndex((item, index) => value === valueExtractor(item, index));
  };

  const onSelect = (index) => {
    const selectedValue = valueExtractor(data[index], index);
    if (typeof onChangeText === 'function') {
      onChangeText(selectedValue, index, data);
    }
    setInternalValue(selectedValue);
    setTimeout(onClose, 250);
  };

  const selectedItem = () => data[selectedIndex()];

  const keyExtractor = (item, index) => `${index}-${valueExtractor(item, index)}`;

  const renderBase = () => {
    const index = selectedIndex();
    const title = index >= 0 ? labelExtractor(data[index], index) : internalValue;
    return (
      <TextInput
        pointerEvents="none"
        mode="outlined"
        label={placeholder}
        style={styles.input}
        editable={false}
        value={title}
      />
    );
  };

  const renderItem = ({ item, index }) => {
    const value = valueExtractor(item);
    const label = labelExtractor(item);
    const title = label || value;
    return (
      <Option
        key={index}
        width={width}
        index={index}
        selected={selected === index}
        title={title}
        onPress={onSelect}
      />
    );
  };

  return (
    <Menu
      visible={open}
      onDismiss={onClose}
      anchor={
        <TouchableOpacity
          onLayout={({ nativeEvent: { layout: { width } } }) => setWidth(width)}
          style={[style]}
          onPress={!disabled ? onPress : null}
        >
          <View pointerEvents="none">{renderBase()}</View>
          <List.Icon
            icon="arrow-drop-down"
            style={styles.icon}
          />
        </TouchableOpacity>
      }
    >
      <FlatList
        style={styles.list}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </Menu>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
  icon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 16,
  },
  list: {
    maxHeight: 300,
  },
  divider: {
    marginLeft: 16,
  },
});

export default SelectInput;