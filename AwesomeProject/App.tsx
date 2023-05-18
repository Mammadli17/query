import { View, Text, TextInput, Button, FlatList } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const { data: response, isLoading, error, refetch } = useQuery("supplierData", () => {
    return axios.get('https://64568d9d2e41ccf169201e42.mockapi.io/users/users')
      .then(response => response.data);
  }, {
    staleTime: 20000,
    refetchInterval: 5000
  });

  const { mutate: mutatePost } = useMutation((data : any) => {
    return axios.post('https://64568d9d2e41ccf169201e42.mockapi.io/users/users', data);
  }, {
    onSuccess: () => {
      console.log('Success! New item added');
      queryClient.invalidateQueries("supplierData");
    },
    onError: (err) => {
      console.log('Error!', err);
    }
  });

  const { mutate: mutateDelete } = useMutation((id) => {
    return axios.delete(`https://64568d9d2e41ccf169201e42.mockapi.io/users/users/${id}`);
  }, {
    onSuccess: () => {
      console.log('Success! Item deleted');
      queryClient.invalidateQueries("supplierData");
    },
    onError: (err) => {
      console.log('Error!', err);
    }
  });

  const add = () => {
    mutatePost({ name:name,price:price });
  };

  const deleteItem = (id:any) => {
    mutateDelete(id);
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder='name' onChangeText={setName} />
      <TextInput placeholder='unitPrice' onChangeText={setPrice} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title='add' onPress={add} />
        <Button title='refetch' onPress={()=>refetch()} />
      </View>
      <View style={{ flex: 0.5, marginTop: 10 }}>
        <FlatList
          data={response}
          renderItem={({ item }) => (
            <View>
              
              <Text style={{ fontSize: 30 }}>{item.name}, {item.price}</Text>
              <Button title='delete' onPress={() => deleteItem(item.id)} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const RootComponent = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default RootComponent;
