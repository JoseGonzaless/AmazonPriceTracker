import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, FlatList, Image, Pressable, Linking, ActivityIndicator } from "react-native";
import dummyProducts from '~/assets/search.json';
import { supabase } from "~/utils/supabase";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const products = dummyProducts.slice(0, 20);

export default function SearchResultScreen() {
    const { id } = useLocalSearchParams();
    const[search, setSearch] = useState();

    useEffect(() => {
        supabase
        .from('searches')
        .select('*')
        .eq('id', id)
        .single()
        .then(({data}) => setSearch(data))
    }, [id]);

    if (!search) {
        return <ActivityIndicator/>;
    }

    return (
        <View>
            <View className="p-2 m-2 bg-white shadow-sm">
                <Text className="text-xl pb-1">Results for: {search.query}</Text>
                <Text>{dayjs(search.created_at).fromNow()}</Text>
                <Text>{search.status}</Text>
            </View>

            <FlatList
                contentContainerClassName="gap-5 p-3"
                data={products}
                keyExtractor={(item) => item.asin}
                renderItem={({ item }) => (
                    <Pressable onPress={() => Linking.openURL(item.url)} className="flex-row bg-white p-3">
                        <Image source={{ uri: item.image }} className="w-20 h-20"></Image>
                        <Text className="flex-1" numberOfLines={4}>{item.name}</Text>
                        <Text className="flex-center">${item.final_price}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}