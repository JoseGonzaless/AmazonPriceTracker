import dayjs from 'dayjs';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {Text, View, TextInput, Pressable, FlatList } from 'react-native';
import { useAuth } from '~/app/contexts/AuthContext';
import { supabase } from '~/utils/supabase';

export default function Home() {
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const { user } = useAuth();

  const fetchHistory = () => {
    supabase
      .from('searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({data}) => setHistory(data));
  };

  useEffect(() => {
    fetchHistory();
  }, []);
  
  const performSearch = async () => {
    //save this search in database
    const {data, error} = await supabase.from('searches').insert({
      query: search,
      user_id: user.id,
    })
      .select()
      .single();

    if (data) {
      router.push(`/search/${data.id}`);
    }

    //scrape amazon for this queryS
  };

  return (
    <View className='bg-white flex-1'>
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

      <FlatList 
        data={history} 
        contentContainerClassName='p-2 gap-2 '
        onRefresh={fetchHistory}
        refreshing={false}
        renderItem={({item}) => (
          <View className='border-b border-gray-200 pb-2'>
            <Text className='font-semibold'>{item.query}</Text>
            <Text className='color-gray'>{dayjs(item.created_at).fromNow()}</Text>
          </View>
        )}
      />
    </View>
  );
}