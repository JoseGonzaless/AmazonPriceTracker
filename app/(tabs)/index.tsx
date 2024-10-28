import { router, Stack } from 'expo-router';
import { useState } from 'react';
import {Text, View, TextInput, Pressable } from 'react-native';

export default function Home() {
  const [search, setSearch] = useState('');

  const performSearch = () => {
    console.warn('Search', search);

    //save this search in database

    //scrape amazon for this queryS

    router.push('/search');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Search' }} />
      <View className='flex-row gap-3 p-3'>
        <TextInput 
          value={search}
          onChangeText={setSearch}
          placeholder='Search for a item' 
          className='flex-1 rounded border bg-gray-200 p-3'
        />
        
        <Pressable onPress={performSearch} className='rounded bg-teal-500 p-3'>
          <Text>Search</Text>
        </Pressable>
      </View>
    </>
  );
}