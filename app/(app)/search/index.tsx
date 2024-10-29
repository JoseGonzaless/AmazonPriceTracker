import { Text, View, FlatList, Image, Pressable, Linking } from "react-native";
import dummyProducts from '~/assets/search.json';

const products = dummyProducts.slice(0, 20);

export default function SearchResultScreen() {
    return (
        <View>
            <Text className="text-xl">Search Results</Text>

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