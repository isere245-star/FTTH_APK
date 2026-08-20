import { View, Text, Pressable, TextInput, StatusBar, StyleSheet  } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { useState } from "react";

export default function Models () {

    const router = useRouter();
    const [disable, setDisable] = useState(false)

    return (
        <>

            <StatusBar barStyle={'light-content'} />
            <SafeAreaView style = {styles.fond}>

                <View style = {styles.card}>
                    <Text style = {[styles.text, {fontSize : 18, padding : 5}]}>
                         FTTH 
                    </Text>
                    <Text style = {styles.text_secondary}>
                        Générer et copier le rapport sur WhatsApp
                    </Text>
                </View>

                <View>
                    <Text style = {[styles.text_secondary, styles.text_center]}>
                        Veuillez choisir un rapport :
                    </Text>
                </View>

                <View style = {styles.button_card}>
                    <Pressable style = {styles.button} onPress={() => {  router.push('/Production')} }>
                        <Text style = {styles.text_secondary}> PRODUCTION </Text>
                    </Pressable>
                    <Pressable style = {styles.button} onPress={() => router.push('/Derangement')}>
                        <Text style = {styles.text_secondary}> DERANGEMENT </Text>
                    </Pressable>
                </View>

            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create ({
    fond : {
        backgroundColor : '#0F172A',
        height : '100%',
    },
    card : {
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 10
    },
    text : {
        fontWeight : 500,
        color : '#F8FAFC'
    },
    text_secondary : {
        color : '#94A3B8'
    },
    text_center : {
        textAlign : 'center'
    },
    button : {
        flex : 1,
        justifyContent : 'center',
        backgroundColor : '#1E293B',
        maxHeight : 50,
        borderRadius : 8,
        paddingLeft : 10,
        fontWeight : 500
        
    },
    button_card : {
        flex : 1,
        flexDirection : 'column',
        padding : 10,
        gap : 10
    }
})