import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, FlatList, Image, Pressable, Linking, ActivityIndicator, TouchableOpacity } from "react-native";
import { supabase } from "~/utils/supabase";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function SearchResultScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const[search, setSearch] = useState();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchSearch();
        fetchProducts();
    }, [id]);

    const fetchSearch = () => {
        supabase
            .from('searches')
            .select('*')
            .eq('id', id)
            .single()
            .then(({data}) => setSearch(data));
    };

    const fetchProducts = () => {
        supabase
            .from('product_search')
            .select('*, products(*)')
            .eq('search_id', id)
            .then(({ data, error }) => {
                console.log(data, error);
                setProducts(data?.map((d) => d.products));
        });
    };

    useEffect(() => {
        //Listen to inserts
        const subscription = supabase
            .channel('supabase_realtime')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'searches' }, 
                (payload) => {
                    console.log(JSON.stringify(payload.new, null, 2));
                    if (payload.new?.id == parseInt(id, 10)) {
                        setSearch(payload.new);
                        fetchProducts();
                    }
                }
            )
            .subscribe();

        return () => subscription.unsubscribe();
    }, []);

    const startScraping = async () => {
        const {data, error} = await supabase.functions.invoke("scrape-start", {
            body: JSON.stringify({ record: search })
        });
        console.log(data, error);
    };

    if (!search) {
        return <ActivityIndicator/>;
    }

    return (
<View className="bg-gray-100 flex-1">
    {/* Header/Info Section */}
    <View className="p-2 m-2 bg-white rounded-lg shadow-sm">
        <Text className="text-2xl font-semibold text-gray-800 pb-2">Results for: {search.query}</Text>
        <Text className="text-gray-500">{dayjs(search.created_at).fromNow()}</Text>
        <Text className="text-sm text-gray-600 mb-4">{search.status}</Text>

        {/* Custom Button with TouchableOpacity */}
        <TouchableOpacity
            onPress={startScraping}
            className="bg-blue-600 py-2 px-10 rounded-lg shadow-sm"
        >
            <Text className="text-white text-center font-medium">Start Scraping</Text>
        </TouchableOpacity>
    </View>

    {/* Product List */}
    <FlatList
        contentContainerClassName="gap-5 p-3"
        data={products}
        keyExtractor={(item) => item.asin}
        renderItem={({ item }) => (
            <Pressable 
                onPress={() => Linking.openURL(item.url)} 
                className="flex-row bg-white p-4 rounded-lg shadow-sm items-center"
            >
                <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-md mr-3"
                />
                <View className="flex-1">
                    <Text className="text-gray-800 font-medium" numberOfLines={4}>{item.name}</Text>
                    <Text className="text-blue-600 font-semibold mt-1">${item.final_price}</Text>
                </View>
            </Pressable>
        )}
    />
</View>

    );
}