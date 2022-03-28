import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists items (id integer primary key not null, amount text, name text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into items (amount, name) values (?, ?);', [amount, name]);
    }, null, updateList);
    console.log(shoppingList);
  };

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from items;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from items where id = ?;', [id]);
    }, null, updateList);
  };

  const listHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.listHeader}>Shopping list</Text>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} onChangeText={(name) => setName(name)} value={name} placeholder='Item' />
        <TextInput style={styles.input} onChangeText={(amount) => setAmount(amount)} value={amount}
          placeholder='Amount' />
      </View>
      <View style={styles.button}>
        <Button style={styles.button} onPress={saveItem} title='Save' />
      </View>
      <FlatList
        ListHeaderComponent={listHeader}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.list}>
            <Text style={styles.listText}>{item.name}, {item.amount}</Text>
            <Text style={styles.listDelete} onPress={() => deleteItem(item.id)}> bought</Text>
          </View>}
        data={shoppingList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    paddingTop: 100
  },
  input: {
    marginBottom: 30,
    width: 200
  },
  button: {
    marginBottom: 30
  },
  list: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  listText: {
    fontSize: 20,
    marginBottom: 10
  },
  headerContainer: {
    alignItems: 'center'
  },
  listHeader: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  listDelete: {
    fontSize: 20,
    color: '#FF0000',
    marginBottom: 10
  }
});
