import { View, Text, Pressable, StatusBar, ScrollView, KeyboardAvoidingView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect } from "react"

export default function Historique () {
    return (
        <>
            <StatusBar barStyle={'light-content'}/>

            <SafeAreaView style = {styleSheet.fond}>
                <Text> Les Historiques </Text>
            </SafeAreaView>
        </>
    )
}

const styleSheet = StyleSheet.create({
    fond: {
        backgroundColor: '#0F172A',
        color: '#94A3B8',
        minHeight: '100%'
    }
})