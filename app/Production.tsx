import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function Production() {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const etat = [
    { label: "LOS", value: "LOS" },
    { label: "PON", value: "PON" },
  ];
  const cable = [
    { label: "CPC", value: "CPC" },
    { label: "TOURRE", value: "TOURRE" },
  ];

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const dateAffichee = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [location, setLocation] = useState<Record<ListType, Localisation[]>>({
    PoteauxArmes: [],
    PoteauxImplantes: [],
  });

  const [form, setForm] = useState({
    Equipe: "RAINIER",
    Client: "",
    Ligne: "",
    Mobile: "",
    Date: dateAffichee,
    Etat: "PON",
    Msan: "",
    Port: "",
    PortDisponible: "",
    Lineaire: "",
    Depart: "",
    Arriver: "00",
    TypeCable: "CPC",
    PuissanceFAT: "",
    PuissancePTO: "",
    MAC: "",
    SN: "",
    PoteauxTraverser: "00",
    PoteauxImplanter: "00",
    Rue: "01",
    Pince: "00",
    Crochets: "00",
    Susp: "00",
    Piton: "01",
    Closer: "00",
    RP1: "00",
    Traverse13T: "00",
    Traverse15T: "00",
    SemelleEq: "00",
    PoteauxSBEEArmes: "00",
    GPSPoteauxAArme: location.PoteauxArmes,
    GPSPoteauxImplante: location.PoteauxImplantes,
    GPS_CLIENT: "",
    GPS_FAT: "",
  });

  type Localisation = {
    id: string;
    label: string;
    latitude: string;
    longitude: string;
  };
  type ListType = "PoteauxArmes" | "PoteauxImplantes";

  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Ajoute un poteau à la liste de localisations correspondante.
  const addLocalisation = (type: ListType) => {
    const newId = Date.now().toString();
    setLocation((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          id: newId,
          label: `Poteaux ${prev[type].length + 1}`,
          latitude: "",
          longitude: "",
        },
      ],
    }));
  };

  const removeLocalisation = (id: string, type: ListType) => {
    setLocation((prev) => ({
      ...prev,
      [type]: [...prev[type].filter((loc) => loc.id !== id)],
    }));
  };

  // Récupère la position GPS d'un poteau sélectionné.
  const getListLocalisation = async (id: string, type: ListType) => {
    setLoadingId(id);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erreur", "Permission refusé");
      setLoadingId(null);
      return;
    }
    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = loc.coords;

      setLocation((prev) => ({
        ...prev,
        [type]: prev[type].map((loc) =>
          loc.id === id
            ? {
                ...loc,
                latitude: String(latitude.toFixed(6)),
                longitude: String(longitude.toFixed(6)),
              }
            : loc,
        ),
      }));
    } catch (e) {
      Alert.alert("Erreur", "Localisation non détecté !");
    }
    setLoadingId(null);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [copiedText, setCopiedText] = useState(false);

  const textACopier = `
*Equipe:* ${form.Equipe}\n
*RACCORDEMENT* \n
*Client:* ${form.Client}\n
*Ligne:* ${form.Ligne}\n
*Mobile:* ${form.Mobile}\n
*Date:* ${dateAffichee}\n
*Etat:* ${form.Etat}\n
*Msan:* ${form.Msan}\n
*Port:* ${form.Port}\n
*Port Disponible:* ${form.PortDisponible}\n
*Linéaire (m):* ${form.Lineaire} m\n
*Départ (m):* ${form.Depart} m\n
*Arrivé (m):* ${form.Arriver} m\n
*Type de câble:* ${form.TypeCable}\n
*Puissance FAT (dBm):* - ${form.PuissanceFAT} dBm\n
*Puissance PTO (dBm):* -${form.PuissancePTO} dBm\n
*MAC:* ${form.MAC}\n
*SN:* ${form.SN}\n
*Poteaux traversés:* ${form.PoteauxTraverser}\n
*Poteaux implantés:* ${form.PoteauxImplanter}\n
*Rue:* ${form.Rue}\n
*Pince:* ${form.Pince}\n
*Crochets:* ${form.Crochets}\n
*Susp:* ${form.Susp}\n
*Piton:* ${form.Piton}\n
*Closer:* ${form.Closer}\n
*RP1:* ${form.RP1}\n
*Traverse 13T:* ${form.Traverse13T}\n
*Traverse 15T:* ${form.Traverse15T}\n
*Semelle Eq:* ${form.SemelleEq}\n
*Poteaux SBEE armés:* ${form.PoteauxSBEEArmes}\n
*GPS Poteaux à armé:* \n
    ${location["PoteauxArmes"].map(
      (loc) =>
        ` 
            ${loc.label} : ${loc.latitude} , ${loc.longitude}\n`,
    )}\n
*GPS Poteaux implanté:* \n
    ${location["PoteauxImplantes"].map(
      (loc) =>
        ` 
            ${loc.label} : ${loc.latitude} , ${loc.longitude}\n`,
    )}\n
*GPS Abonné:* ${form.GPS_CLIENT}\n
*GPS FAT:* ${form.GPS_FAT}
            `;

  // Copie le rapport généré dans le presse-papiers.
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(textACopier);
    setCopiedText(true);
    Alert.alert("Succès", "Le texte a été copié dans le presse-papiers.");
  };

  const [textField, setTextField] = useState<string | null>(null);

  // Récupère la position GPS du FAT ou de l'abonné.
  const getLocation = async (prefix: "FAT" | "CLIENT") => {
    setTextField(prefix);

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("erreur", "Permission refusé");
      setTextField(null);
      return;
    }
    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = loc.coords;

      setForm((prev) => ({
        ...prev,
        [`GPS_${prefix}`]:
          String(loc.coords.latitude.toFixed(6)) +
          " , " +
          String(loc.coords.longitude.toFixed(6)),
      }));
    } catch (error) {
      console.error("GPS", error);
      Alert.alert("Erreur", "Localisation non détecté !");
    }
    setTextField(null);
  };

  // Prépare l'enregistrement du formulaire.
  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <>
      <StatusBar barStyle={"light-content"} />

      {/* Conteneur principal de la fiche de production */}
      <SafeAreaView style={styles.fond}>
        <KeyboardAvoidingView style={styles.keyboard}>
          <ScrollView>
            {/* En-tête de la fiche */}
            <View
              style={{
                flex: 0,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                padding: 15,
              }}
            >
              <Text style={styles.text_primary}> Fiche de production </Text>
            </View>

            <View style={styles.scroll}>
              {/* ==================== INFORMATIONS GENERALES ==================== */}
              <View style={styles.button_cards}>
                <Text style={styles.text_primary}> Information générale </Text>

                <View style={styles.button_card}>
                  <View style={styles.label}>
                    <Text style={styles.text}> Equipe </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.Equipe}
                      onChangeText={(text) => handleChange("Equipe", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Client </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.Client}
                      onChangeText={(text) => handleChange("Client", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Ligne </Text>
                    <TextInput
                      style={styles.inupt}
                      keyboardType="numeric"
                      value={form.Ligne}
                      onChangeText={(text) => handleChange("Ligne", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Mobile </Text>
                    <TextInput
                      style={styles.inupt}
                      keyboardType="numeric"
                      value={form.Mobile}
                      onChangeText={(text) => handleChange("Mobile", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Date </Text>

                    <Pressable
                      style={styles.pressable}
                      onPress={() => setShow(true)}
                    >
                      <Text
                        style={{
                          color: "#94A3B8",
                          fontWeight: 300,
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {dateAffichee}{" "}
                      </Text>
                    </Pressable>

                    {show && (
                      <DateTimePicker
                        style={styles.inupt}
                        value={date}
                        mode="date"
                        disabled={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={onChange}
                      />
                    )}
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Etat </Text>
                    <Dropdown
                      style={styles.inupt}
                      data={etat}
                      labelField="label"
                      valueField="value"
                      placeholder="PON"
                      selectedTextStyle={{
                        color: "#94A3B8",
                        fontWeight: 300,
                        fontSize: 12,
                      }}
                      placeholderStyle={{
                        color: "#94A3B8",
                        fontWeight: 300,
                        fontSize: 12,
                      }}
                      value={form.Etat}
                      onChange={(item) => handleChange("Etat", item.value)}
                    />
                  </View>
                </View>
              </View>

              {/* ==================== INFORMATIONS TECHNIQUES ==================== */}
              <View style={styles.button_cards}>
                <Text style={styles.text_primary}> Information technique </Text>

                <View style={styles.button_card}>
                  <View style={styles.label}>
                    <Text style={styles.text}> Msan </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.Msan}
                      onChangeText={(text) => handleChange("Msan", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Port </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.Port}
                      onChangeText={(text) => handleChange("Port", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Port disponible </Text>
                    <TextInput
                      style={styles.inupt}
                      keyboardType="numeric"
                      value={form.PortDisponible}
                      onChangeText={(text) =>
                        handleChange("PortDisponible", text)
                      }
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Linéaire (m) </Text>
                    <TextInput
                      style={styles.inupt}
                      keyboardType="numeric"
                      value={form.Lineaire}
                      onChangeText={(text) => handleChange("Lineaire", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Type de câble </Text>
                    <Dropdown
                      style={styles.inupt}
                      data={cable}
                      labelField="label"
                      valueField="value"
                      placeholder="CPC"
                      selectedTextStyle={{
                        color: "#94A3B8",
                        fontWeight: 300,
                        fontSize: 12,
                      }}
                      placeholderStyle={{
                        color: "#94A3B8",
                        fontWeight: 300,
                        fontSize: 12,
                      }}
                      value={form.TypeCable}
                      onChange={(item) => handleChange("TypeCable", item.value)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Départ (m) </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.Depart}
                      keyboardType="numeric"
                      onChangeText={(text) => handleChange("Depart", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Arrivé (m) </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.Arriver}
                      keyboardType="numeric"
                      onChangeText={(text) => handleChange("Arriver", text)}
                    />
                  </View>
                </View>
              </View>

              {/* ==================== PUISSANCES ==================== */}
              <View style={styles.button_cards}>
                <Text style={styles.text_primary}> Puissances </Text>

                <View style={styles.button_card}>
                  <View style={styles.label}>
                    <Text style={styles.text}> Puissance FAT </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.PuissanceFAT}
                      onChangeText={(text) =>
                        handleChange("PuissanceFAT", text)
                      }
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Puissance PTO </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.PuissancePTO}
                      onChangeText={(text) =>
                        handleChange("PuissancePTO", text)
                      }
                    />
                  </View>
                </View>
              </View>

              {/* ==================== EQUIPEMENTS ==================== */}
              <View style={styles.button_cards}>
                <Text style={styles.text_primary}> Equipements </Text>

                <View style={styles.button_card}>
                  <View style={styles.label}>
                    <Text style={styles.text}> MAC </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.MAC}
                      onChangeText={(text) => handleChange("MAC", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> SN </Text>
                    <TextInput
                      style={styles.inupt}
                      value={form.SN}
                      onChangeText={(text) => handleChange("SN", text)}
                    />
                  </View>
                </View>
              </View>

              {/* ==================== MATERIELS UTILISES ==================== */}
              <View style={styles.button_cards}>
                <Text style={styles.text_primary}> Materiels utilisé </Text>

                <View style={styles.button_card}>
                  <View style={styles.label}>
                    <Text style={styles.text}> Poteaux traversés </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.PoteauxTraverser}
                      onChangeText={(text) =>
                        handleChange("PoteauxTraverser", text)
                      }
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Poteaux implantés </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.PoteauxImplanter}
                      onChangeText={(text) =>
                        handleChange("PoteauxImplanter", text)
                      }
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Rue </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Rue}
                      onChangeText={(text) => handleChange("Rue", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Pince </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Pince}
                      onChangeText={(text) => handleChange("Pince", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Crochets </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Crochets}
                      onChangeText={(text) => handleChange("Crochets", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Susp </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Susp}
                      onChangeText={(text) => handleChange("Susp", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Piton </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Piton}
                      onChangeText={(text) => handleChange("Piton", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Closer </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Closer}
                      onChangeText={(text) => handleChange("Closer", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> RP1 </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.RP1}
                      onChangeText={(text) => handleChange("RP1", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Traverse 13T </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Traverse13T}
                      onChangeText={(text) => handleChange("Traverse13T", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Traverse 15T </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.Traverse15T}
                      onChangeText={(text) => handleChange("Traverse15T", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Semelle Eq </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.SemelleEq}
                      onChangeText={(text) => handleChange("SemelleEq", text)}
                    />
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Poteaux SBEE armés </Text>
                    <TextInput
                      keyboardType="numeric"
                      style={styles.inupt}
                      value={form.PoteauxSBEEArmes}
                      onChangeText={(text) =>
                        handleChange("PoteauxSBEEArmes", text)
                      }
                    />
                  </View>
                </View>
              </View>

              {/* ==================== GPS ==================== */}
              <View style={styles.button_cards}>
                <Text style={styles.text_primary}> GPS </Text>

                <View style={styles.button_card}>
                  <View style={styles.label}>
                    <Text style={styles.text}> Poteaux à armé </Text>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      {location["PoteauxArmes"].map((loc, index) => (
                        <View
                          key={loc.id}
                          style={{
                            flex: 0,
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <View>
                            <Text style={styles.text}>
                              {loc.label} : {loc.latitude} {loc.longitude}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0,
                              flexDirection: "column",
                            }}
                          >
                            <Pressable
                              onPress={() =>
                                removeLocalisation(loc.id, "PoteauxArmes")
                              }
                              style={{
                                flex: 0,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                                height: 20,
                                width: 20,
                              }}
                            >
                              <IconSymbol
                                name="trash.fill"
                                size={20}
                                color={"#991b1b"}
                              />
                            </Pressable>
                          </View>
                          <Pressable
                            onPress={() =>
                              getListLocalisation(loc.id, "PoteauxArmes")
                            }
                            style={styles.pressable}
                            disabled={loadingId === loc.id}
                          >
                            {loadingId === loc.id ? (
                              <ActivityIndicator />
                            ) : (
                              <IconSymbol
                                name="location"
                                size={20}
                                color={"#450a0a"}
                              />
                            )}
                          </Pressable>
                        </View>
                      ))}
                      <Pressable
                        onPress={() => addLocalisation("PoteauxArmes")}
                        style={styles.pressable}
                      >
                        <IconSymbol name="plus" size={20} color={"#22c55e"} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> Poteaux implanté </Text>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      {location["PoteauxImplantes"].map((loc, index) => (
                        <View
                          key={loc.id}
                          style={{
                            flex: 0,
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <View>
                            <Text style={styles.text}>
                              {loc.label} : {loc.latitude} {loc.longitude}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0,
                              flexDirection: "column",
                            }}
                          >
                            <Pressable
                              onPress={() =>
                                removeLocalisation(loc.id, "PoteauxImplantes")
                              }
                              style={{
                                flex: 0,
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                                height: 20,
                                width: 20,
                              }}
                            >
                              <IconSymbol
                                name="trash.fill"
                                size={20}
                                color={"#991b1b"}
                              />
                            </Pressable>
                          </View>
                          <Pressable
                            onPress={() =>
                              getListLocalisation(loc.id, "PoteauxImplantes")
                            }
                            style={styles.pressable}
                            disabled={loadingId === loc.id}
                          >
                            {loadingId === loc.id ? (
                              <ActivityIndicator />
                            ) : (
                              <IconSymbol
                                name="location"
                                size={20}
                                color={"#450a0a"}
                              />
                            )}
                          </Pressable>
                        </View>
                      ))}
                      <Pressable
                        onPress={() => addLocalisation("PoteauxImplantes")}
                        style={styles.pressable}
                      >
                        <IconSymbol name="plus" size={20} color={"#22c55e"} />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> FAT </Text>
                    <Pressable
                      style={styles.pressable}
                      onPress={() => getLocation("FAT")}
                    >
                      {textField === "FAT" ? (
                        <ActivityIndicator color={"#94A3B8"} />
                      ) : (
                        <Text
                          style={{
                            color: "#94A3B8",
                            fontWeight: 300,
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {form.GPS_FAT !== null
                            ? form.GPS_FAT
                            : "Non défini"}{" "}
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  <View style={styles.label}>
                    <Text style={styles.text}> ABONNE </Text>
                    <Pressable
                      style={styles.pressable}
                      onPress={() => getLocation("CLIENT")}
                    >
                      {textField === "CLIENT" ? (
                        <ActivityIndicator color={"#94A3B8"} />
                      ) : (
                        <Text
                          style={{
                            color: "#94A3B8",
                            fontWeight: 300,
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {form.GPS_CLIENT !== null
                            ? form.GPS_CLIENT
                            : "Non défini"}{" "}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            {/* ==================== BOUTONS D'ACTION ==================== */}
            <View style={styles.buttonView}>
              {/* Bouton permettant de copier le rapport WhatsApp */}
              <Pressable
                style={{
                  backgroundColor: "#2563EB",
                  borderRadius: 8,
                  borderWidth: 0.5,
                }}
                onPress={copyToClipboard}
              >
                <View
                  style={{
                    width: "100%",
                    flex: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 5,
                  }}
                >
                  <IconSymbol
                    name="list.clipboard.fill"
                    size={28}
                    color={"#94A3B8"}
                  />
                  <Text
                    style={{
                      fontWeight: 500,
                      color: "#F8FAFC",
                      opacity: 0.6,
                    }}
                  >
                    {" "}
                    Copier le rapport WhatsApp{" "}
                  </Text>
                </View>
              </Pressable>

              <View style={styles.buttonAll}>
                {/* Bouton permettant d'enregistrer le formulaire */}
                <Pressable
                  style={{
                    backgroundColor: "#052e16",
                    borderColor: "#166534",
                    borderRadius: 8,
                    borderWidth: 0.5,
                  }}
                  onPress={handleSubmit}
                >
                  <View
                    style={{
                      width: "100%",
                      flex: 0,
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <IconSymbol size={28} name="doc" color={"#22c55e"} />
                    <Text
                      style={{
                        fontWeight: 500,
                        color: "#22c55e",
                        opacity: 0.6,
                      }}
                    >
                      {" "}
                      Enregistrer{" "}
                    </Text>
                  </View>
                </Pressable>
                {/* Bouton permettant de réinitialiser le formulaire */}
                <Pressable
                  style={{
                    backgroundColor: "#450a0a",
                    borderColor: "#991b1b",
                    borderRadius: 8,
                    borderWidth: 0.5,
                  }}
                  onPress={copyToClipboard}
                >
                  <View
                    style={{
                      width: "100%",
                      flex: 0,
                      flexDirection: "row",
                      alignItems: "center",
                      opacity: 0.6,
                      padding: 5,
                    }}
                  >
                    <IconSymbol name="trash.fill" size={28} color={"#991b1b"} />
                    <Text
                      style={{
                        fontWeight: 500,
                        color: "#991b1b",
                        opacity: 0.6,
                      }}
                    >
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
  );
}

const styles = StyleSheet.create({
  fond: {
    backgroundColor: "#0F172A",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontWeight: 300,
    color: "#94A3B8",
  },
  text_primary: {
    fontWeight: 500,
    color: "#F8FAFC",
  },
  button_card: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
    justifyContent: "space-between",
  },
  button_cards: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 15,
    backgroundColor: "#1E293B",
    width: "100%",
    paddingTop: 20,
  },
  inupt: {
    borderWidth: 0.5,
    borderColor: "#1E293B",
    width: 100,
    borderRadius: 5,
    padding: 5,
    fontWeight: 300,
    color: "#94A3B8",
    backgroundColor: "#0F172A",
  },
  inupts: {
    borderWidth: 0.5,
    borderColor: "#1E293B",
    backgroundColor: "#ffffff",
    color: "#242629",
    minHeight: 40,
    width: 100,
    borderRadius: 8,
    padding: 7,
    fontWeight: 300,
  },
  pressable: {
    borderWidth: 0.5,
    borderColor: "#1E293B",
    width: 100,
    borderRadius: 5,
    padding: 5,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F172A",
  },
  label: {
    flex: 0,
    flexDirection: "column",
    gap: 10,
    minWidth: 100,
  },
  scroll: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    gap: 20,
    margin: 20,
  },
  keyboard: {
    flex: 1,
  },
  buttonView: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  buttonAll: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
});
