import { ScrollView, View, Text, Pressable, TextInput, StatusBar, StyleSheet , KeyboardAvoidingView, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import DateTimePicker ,{ DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { Dropdown } from "react-native-element-dropdown"
import { useState } from "react"
import { Platform } from "react-native"
import * as Clipboard from "expo-clipboard"
import * as Location from 'expo-location'
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function Derangement () {

    const zone = [
        {label: 'PARAKOU', value: 'PARAKOU'},
        {label: 'NIKKI', value: 'NIKKI'}
    ]
    const type = [
        {label: 'B2C', value: 'B2C'},
        {label: 'B2B', value: 'B2B'}
    ]
    type Localisation = {
        id: string
        label: string
        latitude: string
        longitude: string
    }
    type ListType = 'PoteauxArmes' | 'PoteauxImplantes'

    const [location, setLocation] = useState <Record<ListType, Localisation[]>>({
        PoteauxArmes: [],
        PoteauxImplantes: []       
    })

    const [loadingId, setLoadingId] = useState< string | null>(null)

    const addLocalisation = (type: ListType) => {
        const newId = Date.now().toString()
        setLocation( (prev) => ({
            ...prev,
            [type]: [...prev[type],{
                id: newId,
                label: `Poteaux ${prev[type].length + 1}`,
                latitude: '',
                longitude: ''
            }]
        }))
    }

    const removeLocalisation = (id: string, type: ListType) => {
        setLocation( prev => ({
            ...prev,
            [type]: [...prev[type].filter(loc => loc.id !== id)]
        }))
    }

    const getListLocalisation = async (id: string, type: ListType) => {
        
        setLoadingId(id)

        let { status } = await Location.requestForegroundPermissionsAsync()
        if ( status !== 'granted'){
            Alert.alert('Erreur','Permission refusé')
            setLoadingId(null)
            return
        }
        try {
            let loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest})
            const {latitude, longitude} = loc.coords

            setLocation( prev => ({
                ...prev,
                [type]: prev[type].map( 
                    loc => loc.id === id ? {
                        ...loc,
                        latitude: String(latitude.toFixed(6)),
                        longitude:String(longitude.toFixed(6))
                    }: loc
                )
            }))
        }
        catch (e){
           Alert.alert('Erreur',  'Localisation non détecté !')
        }
        setLoadingId(null)
        
    }

    const [form, setForm] = useState({
        Equipe: 'RAINIER',
        Date_Date: '',
        Date_Signalisation: '',
        Date_Intervention: '',
        Date_Debut: '',
        Date_Fin: '',
        Client: '',
        Ligne: '',
        Mobile: '',
        Zone: 'PARAKOU',
        Type: 'B2C',
        Msan: '',
        Pout: '',
        Constat: '',
        TravauxEffectue: '',
        GPS_Fat: '',
        GPS_Client: '',
        Poteaux_Arme: location['PoteauxArmes'],
        Poteaux_Implante: location['PoteauxImplantes']

    })

    const [copiedText, setCopiedText] = useState(false);

    const textACopier = 
    `
*ÉQUIPE :* ${form.Equipe} \n 
*DÉRANGEMENT* \n
*DATE :* ${form.Date_Date} \n 
*CLIENT :* ${form.Client} \n
*MSAN :* ${form.Msan} \n
*LIGNE :* ${form.Ligne} \n
*MOBILE :* ${form.Mobile} \n
*CONSTAT :* \n
    ${form.Constat} \n
*TRAVAUX EFFECTUÉS :* \n
    ${form.TravauxEffectue} \n
*POUT :* - ${form.Pout} dBm \n
*DATE DE SIGNALISATION :* ${form.Date_Signalisation} \n
*DATE D' INTERVENTION :* ${form.Date_Intervention} \n
*HEURE DE DÉBUT :* ${form.Date_Debut} \n
*HEURE DE FIN :* ${form.Date_Fin} \n
*ZONE :* ${form.Zone} \n
*GPS POTEAUX A ARMÉS :* \n
    ${location['PoteauxArmes'].map( loc => 
       ` 
            ${loc.label} : ${loc.latitude} , ${loc.longitude}\n`
    )}\n
*GPS POTEAUX IMPLANTÉS :* \n
    ${location['PoteauxImplantes'].map( loc => 
       ` 
            ${loc.label} : ${loc.latitude} , ${loc.longitude}\n`
    )}\n
*GPS ABONNÉE :* ${form.GPS_Client} \n
*GPS FAT :* ${form.GPS_Fat} \n
    `

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(textACopier)
        setCopiedText(true)
        Alert.alert ('Succès', 'Le texte a été copié dans le presse-papiers.')
    }

    const getLocation = async (prefix: 'Fat' | 'Client') => {

        setTextField(prefix)

        let { status } = await Location.getForegroundPermissionsAsync()

        if ( status !== 'granted' ){
            Alert.alert('Erreur', 'Permission refusé, veuillez activer la localisation')
            setTextField(null)
            return
        } 
        try {
            let loc = await Location.getCurrentPositionAsync(
                {accuracy: Location.Accuracy.Highest}
            )
            const {latitude, longitude} = loc.coords
            setForm( (prev) => ({
                ...prev,
                [`GPS_${prefix}`]: String(latitude.toFixed(6)) + ' , ' + String(longitude.toFixed(6))
            }))
        }
        catch (e){
            Alert.alert('Erreur', 'Localisation non détecté !')
        }
        setTextField(null)
    }

    const handleChange = (key: keyof typeof form, value: string ) => {
        setForm( (prev) => ({
            ...prev,
            [key]: value
        }))

    }

    const [showPicker, setShowpicker] = useState(false)
    const [TextField, setTextField] = useState< 'Date' | 'Signalisation' | 'Intervention' | 'Debut' | 'Fin' | 'Fat' | 'Client' |null >(null)
    const [mode, setMode] = useState< 'date' | 'time' | 'datetime'>('date')

    const openPicker = (prefix: 'Date' | 'Signalisation' | 'Intervention' | 'Debut' | 'Fin', pickerMode: 'date' | 'time' = 'date') => {
        setTextField(prefix)
        setMode(pickerMode)
        setShowpicker(true)
    }

    const onChangeDate = (event: any, selectedDate? : Date) => {
        setShowpicker(false)
        if (event.type === 'dismissed' || !selectedDate || !TextField){
            return
        }
        if ( mode === 'date'){

            const formatDate = selectedDate.toLocaleDateString('fr-Fr',{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            })  
            setForm( (prev) => ({
                ...prev,
                [`Date_${TextField}`]: formatDate,
            }))
            setTextField(null)
        }
        else{
            const formatDate = selectedDate.toLocaleTimeString('fr-Fr',{
            hour: '2-digit',
            minute: '2-digit'
            })
            setForm( (prev) => ({
                ...prev,
                [`Date_${TextField}`]: formatDate,
            }))
            setTextField(null)
        }
        
    }

    const handleSubmit = () => {
        console.log(form)
    }
    
    return (
        <>
            <StatusBar barStyle={'light-content'} />
            
            <SafeAreaView style = {styles.fond}>

            <KeyboardAvoidingView style = {styles.keyboard}>
            
            <ScrollView >

            <View style = {styles.scroll}>

                <View style = {styles.button_cards}>

                    <Text  style = {styles.text_primary}> Information générale </Text>

                    <View style = {styles.button_card}>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Equipe </Text>
                            <TextInput 
                                style = {styles.inupt}
                                onChangeText={(text) => handleChange('Equipe', text)} />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Date </Text>
                            <Pressable onPress={() => { openPicker('Date', 'date') }} style = {styles.pressable}>
                               <Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}>  {form.Date_Date}</Text>
                            </Pressable>

                            { showPicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode={mode}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onChangeDate}
                                />
                            )}
                           
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Date de signalisation </Text>
                            <Pressable onPress={() => {openPicker('Signalisation', 'date')}} style = {styles.pressable}>
                               <Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}>  {form.Date_Signalisation}</Text>
                            </Pressable>
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Date d'intervention </Text>
                            <Pressable onPress={() => {openPicker('Intervention', 'date')}} style = {styles.pressable}>
                               <Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}>  {form.Date_Intervention}</Text>
                            </Pressable>
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Heure de début </Text>
                            <Pressable onPress={() => {openPicker('Debut', 'time')}} style = {styles.pressable}>
                               <Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}>  {form.Date_Debut}</Text>
                            </Pressable>
                            
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Heure de fin </Text>
                            <Pressable onPress={() => {openPicker('Fin', 'time')}} style = {styles.pressable}>
                               <Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}>  {form.Date_Fin}</Text>
                            </Pressable>
                        </View>


                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Client </Text>
                            <TextInput 
                                style = {styles.inupt}
                                onChangeText={(text) => handleChange('Client', text)} />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Ligne </Text>
                            <TextInput 
                                style = {styles.inupt} keyboardType="numeric"
                                onChangeText={(text) => handleChange('Ligne', text)}/>
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Mobile </Text>
                            <TextInput 
                                style = {styles.inupt}  keyboardType="numeric"
                                onChangeText={(text) => handleChange('Mobile', text)}
                            />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Zone </Text>
                            <Dropdown
                                style = {styles.inupt}
                                data = {zone}
                                labelField = "label"
                                valueField = "value"
                                placeholder="PARAKOU"
                                selectedTextStyle = {{
                                    color: '#94A3B8',
                                    fontWeight : 300,
                                    fontSize: 12
                                }}
                                placeholderStyle = {{
                                    color : '#94A3B8',fontWeight : 300,
                                    fontSize: 12}}
                                    value={form.Zone}
                                    onChange={(item) => handleChange('Zone', item.value)}  
                            />
                        </View>         
                           
                    </View>
                    
                </View>

                <View style = {styles.button_cards}>

                    <Text  style = {styles.text_primary}> Informations techniques </Text>

                    <View style = {styles.button_card}>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Msan </Text>
                            <TextInput 
                                style = {styles.inupt}
                                onChangeText={(text) => handleChange('Msan', text)} />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Type </Text>
                            <Dropdown
                                style = {styles.inupt}
                                data = {type}
                                labelField = "label"
                                valueField = "value"
                                placeholder="B2C"
                                selectedTextStyle = {{
                                    color: '#94A3B8',
                                    fontWeight : 300,
                                    fontSize: 12
                                }}
                                placeholderStyle = {{
                                    color : '#94A3B8',fontWeight : 300,
                                    fontSize: 12}}
                                    value={form.Type}
                                    onChange={(item) => handleChange('Type', item.value)}  
                            />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}>  POUT (dBm) </Text>
                            <TextInput     
                                style = {styles.inupt}
                                onChangeText={(text) => handleChange('Pout', text)} />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Constat </Text>
                            <TextInput  
                                style = {styles.inupt}
                                onChangeText={(text) => handleChange('Constat', text)}
                                multiline ={true}
                                textAlignVertical="top"
                                numberOfLines={5} />
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Travaux effectués </Text>
                            <TextInput  
                                style = {styles.inupt}
                                onChangeText={(text) => handleChange('TravauxEffectue', text)}
                                multiline ={true}
                                textAlignVertical="top"
                                numberOfLines={5} />
                        </View>

                    </View>

                </View>
                
                <View style = {styles.button_cards}>

                    <Text  style = {styles.text_primary}> GPS </Text>

                    <View style = {styles.button_card}>

                        <View style = {styles.label}>

                            <Text  style = {styles.text}> Poteaux à armé </Text>
                            <View style = {{
                                            flex: 0,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            gap: 10
                                        }}>

                                {location['PoteauxArmes'].map ((loc, index) => (

                                    <View key={loc.id}
                                    style = {{
                                            flex: 0,
                                            flexDirection: 'column',
                                            gap: 10
                                        }}>

                                        <View >
                                            <Text style = {styles.text}> 
                                                {loc.label} : {loc.latitude }  {loc.longitude}
                                            </Text>
                                            
                                        </View>

                                        <View style = {{
                                            flex: 0,
                                            flexDirection: 'column'
                                        }}>
                                            <Pressable onPress={()=> removeLocalisation(loc.id, 'PoteauxArmes')}
                                                style = {{
                                                    flex :0,
                                                    flexDirection :'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    alignContent: 'center',
                                                    height: 20,
                                                    width: 20,
                                                }}>
                                                <IconSymbol name="trash.fill" size={20} color={'#991b1b'}/> 
                                            </Pressable>
                                        </View>
                                        
                                        <Pressable onPress={() => getListLocalisation(loc.id, 'PoteauxArmes')}
                                            style = {styles.pressable}
                                            disabled= {loadingId === loc.id}>
                                            {loadingId === loc.id ? <ActivityIndicator/> : 
                                                <IconSymbol name="location" size={20} color={'#450a0a'}/>
                                            }

                                        </Pressable>
                                        
                                    </View>
                                ))}
                                <Pressable onPress={() => addLocalisation('PoteauxArmes')} 
                                        style = {
                                            styles.pressable
                                        }>
                                    <IconSymbol name="plus" size={20} color={'#22c55e'}/>
                                </Pressable>
                                
                            </View>

                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> Poteaux implanté </Text>
                            <View style = {{
                                            flex: 0,
                                            flexDirection: 'row',
                                            flexWrap: 'wrap',
                                            gap: 10
                                        }}>

                                {location['PoteauxImplantes'].map ((loc, index) => (

                                    <View key={loc.id}
                                    style = {{
                                            flex: 0,
                                            flexDirection: 'column',
                                            gap: 10
                                        }}>

                                        <View >
                                            <Text style = {styles.text}> 
                                                {loc.label} : {loc.latitude }  {loc.longitude}
                                            </Text>
                                            
                                        </View>

                                        <View style = {{
                                            flex: 0,
                                            flexDirection: 'column'
                                        }}>
                                            <Pressable onPress={()=> removeLocalisation(loc.id, 'PoteauxImplantes')}
                                                style = {{
                                                    flex :0,
                                                    flexDirection :'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    alignContent: 'center',
                                                    height: 20,
                                                    width: 20,
                                                }}>
                                                <IconSymbol name="trash.fill" size={20} color={'#991b1b'}/> 
                                            </Pressable>
                                        </View>
                                        
                                        <Pressable onPress={() => getListLocalisation(loc.id, 'PoteauxImplantes')}
                                            style = {styles.pressable}
                                            disabled= {loadingId === loc.id}>
                                            {loadingId === loc.id ? <ActivityIndicator/> : 
                                                <IconSymbol name="location" size={20} color={'#450a0a'}/>
                                            }

                                        </Pressable>
                                        
                                    </View>
                                ))}
                                <Pressable onPress={() => addLocalisation('PoteauxImplantes')} 
                                        style = {
                                            styles.pressable
                                        }>
                                    <IconSymbol name="plus" size={20} color={'#22c55e'}/>
                                </Pressable>
                                
                            </View>
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}>  ABONNE </Text>
                            <Pressable style = {styles.pressable} onPress={() => getLocation('Client')}>
                                {TextField === 'Client' ? (<ActivityIndicator color={'#94A3B8'}/>) : (<Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}> { form.GPS_Client !== null ? form.GPS_Client : 'Non défini'} </Text>)}
                            </Pressable> 
                        </View>

                        <View style = {styles.label}>
                            <Text  style = {styles.text}> FAT </Text>    
                            <Pressable style = {styles.pressable} onPress={() => getLocation('Fat')}>
                                {TextField === 'Fat' ? (<ActivityIndicator color={'#94A3B8'}/>) : (<Text style = {{color: '#94A3B8', fontWeight: 300, textAlign: 'center'}}> { form.GPS_Fat !== null ? form.GPS_Fat : 'Non défini'} </Text>)}
                            </Pressable>                     
                        </View>

                    </View>

                </View>
                


            </View>

                        <View style = {styles.buttonView}>

                            <Pressable style = {{
                                backgroundColor: '#2563EB',
                                borderRadius: 8,
                                borderWidth: 0.5,
                                
                            }} onPress={copyToClipboard}> 
                                    <View style = {{
                                        width: '100%',
                                        flex: 0,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 5
                                    }}> 
                                        <IconSymbol name="list.clipboard.fill" size={28} color={'#94A3B8'}/>
                                        <Text style = {{
                                            fontWeight: 500,
                                            color: '#F8FAFC',
                                            opacity: 0.6
                                        }}> Copier le rapport WhatsApp </Text> 
                                    </View> 
                            </Pressable>

                            <View style = {styles.buttonAll}>                                        
                                <Pressable style = {{
                                    backgroundColor: '#052e16',
                                    borderColor: '#166534',
                                    borderRadius: 8,
                                    borderWidth: 0.5
                                }} onPress={handleSubmit}> 
                                    <View style = {{
                                        width: '100%',
                                        flex: 0,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 5
                                        
                                    }}>
                                        <IconSymbol size={28} name="doc" color={'#22c55e'}/>
                                       <Text style = {{
                                            fontWeight: 500,
                                            color: '#22c55e',
                                            opacity: 0.6
                                        }}> Enregistrer </Text> 
                                    </View> 

                                </Pressable>
                                <Pressable style = {{
                                    backgroundColor: '#450a0a',
                                    borderColor: '#991b1b',
                                    borderRadius: 8,
                                    borderWidth: 0.5
                                }} onPress={copyToClipboard}> 
                                    <View style = {{
                                        width: '100%',
                                        flex: 0,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        opacity: 0.6,
                                        padding: 5
                                        
                                    }}> 
                                        <IconSymbol name="trash.fill" size={28} color={'#991b1b'}/> 
                                        <Text style = {{
                                            fontWeight: 500,
                                            color: '#991b1b',
                                            opacity: 0.6
                                        }}>
                                            Réinitialiser
                                        </Text> 
                                        </View> 
                                </Pressable> 
                                
                                </View>
                            </View>

            </ScrollView>

            </KeyboardAvoidingView>
            
            </SafeAreaView>
            
        </>
    )
}

const styles = StyleSheet.create ({
    fond : {
        backgroundColor : '#0F172A',
        height : '100%',
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'

    },
    card : {
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        padding : 10
    },
    text : {
        fontWeight : 300,
        color : '#94A3B8',
    },
    text_primary : {
        fontWeight : 500,
        color : '#F8FAFC'
    },
    button_card : {
        flex :1,
        flexDirection : 'row',
        flexWrap : 'wrap',
        padding : 10,
        gap : 10,
        justifyContent: 'space-between'
    },
    button_cards : {
        flex :1,
        flexDirection : 'column',
        gap: 10,
        padding : 10,
        borderRadius : 8,
        elevation : 15,
        backgroundColor : '#1E293B',
        width: '100%',
        paddingTop: 20
    },
    inupt : {
        borderWidth : 0.5,
        borderColor : '#1E293B',
        width : 100,
        borderRadius : 5,
        padding : 5,
        fontWeight : 300,
        color : '#94A3B8',
        backgroundColor: '#0F172A'
    },
    label : {
        flex :0,
        flexDirection :'column',
        gap : 10,
        minWidth: 100,     
    },
    scroll : {
        flex :1,
        flexDirection :'column',
        borderRadius : 8,
        alignItems : 'center',
        justifyContent : 'center',
        padding: 4,
        gap : 20,
        margin : 20,
    },
    keyboard : {
        flex : 1,
    },
    pressable: {
        borderWidth : 0.5,
        borderColor : '#1E293B',
        width: 100,
        borderRadius : 5,
        padding : 5,
        flex: 0,
        alignItems:  'center',
        justifyContent:'center',
        backgroundColor: '#0F172A'
    },
    buttonView: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonAll: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        gap: 10
    }


})