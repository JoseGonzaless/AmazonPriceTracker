import { TextInput, View, Text, Pressable, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { supabase } from '~/utils/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const onSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error creating the account', error.message);
        }
    };

    const onSignUp = async () => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert("Error creating account", error.message);
        }

        console.log(data)
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-100">
            <Stack.Screen options={{ title: 'Login' }} />
            
            <View className='w-full max-w-s gap-3 p-3'>
                <TextInput 
                    value={email}
                    onChangeText={setEmail}
                    placeholder='email' 
                    className='w-full rounded border border-gray-200 bg-white p-5'
                />
                <TextInput 
                    value={password}
                    onChangeText={setPassword}
                    placeholder='password' 
                    secureTextEntry
                    className='w-full rounded border border-gray-200 bg-white p-5'
                />

                <View className="items-center gap-3 pt-3">
                    <Pressable onPress={onSignIn} className="w-60 rounded-xl bg-teal-500 p-3 items-center border border-gray-200 ">
                        <Text className="font-bold color-white">Sign in</Text>
                    </Pressable>

                    <Pressable onPress={onSignUp} className="w-60 rounded-xl bg-teal-500 p-3 items-center border border-gray-200">
                        <Text className="font-bold color-white">Sign up</Text>
                    </Pressable>
                </View>
            </View>
        </View>

    );
}