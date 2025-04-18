import React, { useState, useContext, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Card, RadioButton, Checkbox, Divider } from "react-native-paper";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { theme, progressStepsStyle, dropDownTheme } from "../core/theme";
import { ThemedView } from '@/components/ThemedView';
import ContentHeader from "../components/ContentHeader";
import TextInput from '../components/TextInput';
import { ThemedText } from "@/components/ThemedText";
import i18n from "../core/i18n";
import DropDownPicker from 'react-native-dropdown-picker';
import ReporterDataCommon from '../components/ReporterDataCommon';
import InformationDetailCommon from '../components/InformationDetailCommon';
import { ReportContext } from '@/app/reportContext';
import { AuthContext } from "@/app/authContext";
import { addReport } from '@/database/ReportData';
import { PrevButton, ContinueButton, SubmitButton } from "../components/NavigationButton";
import { checkServerConnectivity, sendDataToServer, sendFilesToServer } from "../core/server";
import Toast from "react-native-toast-message";

const showToast = (state, message, type = 'success') => {
    Toast.show({
        type,
        position: 'top',
        text1: state,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
    });
};

export default function SecurityBreachScreen({ route, navigation }) {

    const { userdata } = useContext(AuthContext);
    const { breachData, updateBreachData, addFile, removeFile, cleanBreachData } = useContext(ReportContext);
    const headerTitle = i18n.t('securityBreach');
    const [loading, setLoading] = useState(false);
    const { title } = route.params || {};

    useEffect(() => {
        if (title && title.startsWith("PL")) {
            updateBreachData('safetyCategory', { value: title, error: '' })
        }
    }, [])

    // Option 1 - 1 : Matkustajaturvallisuus
    const handleExternalHelpChange = (key) => {
        updateBreachData('externalHelp', {
            value: {
                ...breachData.externalHelp.value,
                [key]: !breachData.externalHelp.value[key],
            },
            error: '',
        })
    };
    
    useEffect(() => {
        const unsubscribe = navigation.addListener("state", () => {
            const routes = navigation.getState().routes;
            const currentRoute = routes[routes.length - 1];
    
            if (currentRoute.name === "ReportScreen") {
                cleanBreachData();
            }
        });
    
        return unsubscribe;
    }, [navigation]);


    // Option 2:
    const [option2Open, setOption2Open] = useState(false);
    const [option2Items, setOption2Items] = useState([
        { label: "Ahonpää", value: "Ahonpää" },
        { label: "Ahvenus", value: "Ahvenus" },
        { label: "Ainola", value: "Ainola" },
        { label: "Airaksela", value: "Airaksela" },
        { label: "Aittaluoto", value: "Aittaluoto" },
        { label: "Ajos", value: "Ajos" },
        { label: "Alapitkä", value: "Alapitkä" },
        { label: "Alavus", value: "Alavus" },
        { label: "Alholma", value: "Alholma" },
        { label: "Arola", value: "Arola" },
        { label: "Asola", value: "Asola" },
        { label: "Aviapolis", value: "Aviapolis" },
        { label: "Dragsvik", value: "Dragsvik" },
        { label: "Dynamiittivaihde", value: "Dynamiittivaihde" },
        { label: "Eläinpuisto-Zoo", value: "Eläinpuisto-Zoo" },
        { label: "Eno", value: "Eno" },
        { label: "Ervelä", value: "Ervelä" },
        { label: "Eskola", value: "Eskola" },
        { label: "Espoo", value: "Espoo" },
        { label: "Etelä-Hervanta", value: "Etelä-Hervanta" },
        { label: "Haapajärvi", value: "Haapajärvi" },
        { label: "Haapakoski", value: "Haapakoski" },
        { label: "Haapamäen kyllästämö", value: "Haapamäen kyllästämö" },
        { label: "Haapamäki", value: "Haapamäki" },
        { label: "Haarajoki", value: "Haarajoki" },
        { label: "Hakametsä", value: "Hakametsä" },
        { label: "Hakosilta", value: "Hakosilta" },
        { label: "Haksi", value: "Haksi" },
        { label: "Hallila", value: "Hallila" },
        { label: "Hamina", value: "Hamina" },
        { label: "Hamina satama", value: "Hamina satama" },
        { label: "Hammaslahti", value: "Hammaslahti" },
        { label: "Hanala", value: "Hanala" },
        { label: "Hangonsaari", value: "Hangonsaari" },
        { label: "Hanhikoski", value: "Hanhikoski" },
        { label: "Hankasalmi", value: "Hankasalmi" },
        { label: "HANKO", value: "HANKO" },
        { label: "Hanko asema", value: "Hanko asema" },
        { label: "Hanko satama", value: "Hanko satama" },
        { label: "Hanko-Pohjoinen", value: "Hanko-Pohjoinen" },
        { label: "Harjavalta", value: "Harjavalta" },
        { label: "Harju", value: "Harju" },
        { label: "Harviala", value: "Harviala" },
        { label: "Haukipudas", value: "Haukipudas" },
        { label: "Haukivuori", value: "Haukivuori" },
        { label: "HAUSJÄRVI", value: "HAUSJÄRVI" },
        { label: "Hausjärvi tavara", value: "Hausjärvi tavara" },
        { label: "Haviseva", value: "Haviseva" },
        { label: "Havukoski", value: "Havukoski" },
        { label: "Heikkilä", value: "Heikkilä" },
        { label: "Heinola", value: "Heinola" },
        { label: "Heinoo", value: "Heinoo" },
        { label: "Heinävaara", value: "Heinävaara" },
        { label: "Heinävesi", value: "Heinävesi" },
        { label: "Helsinki asema", value: "Helsinki asema" },
        { label: "Helsinki Kivihaka", value: "Helsinki Kivihaka" },
        { label: "Henna", value: "Henna" },
        { label: "Hermia", value: "Hermia" },
        { label: "Herrala", value: "Herrala" },
        { label: "Hervannan kampus", value: "Hervannan kampus" },
        { label: "Hervantajärvi", value: "Hervantajärvi" },
        { label: "Hervantakeskus", value: "Hervantakeskus" },
        { label: "Hiekkaharju", value: "Hiekkaharju" },
        { label: "Hiirola", value: "Hiirola" },
        { label: "Hikiä", value: "Hikiä" },
        { label: "Hillosensalmi", value: "Hillosensalmi" },
        { label: "Hinthaara", value: "Hinthaara" },
        { label: "Hippos", value: "Hippos" },
        { label: "Hirvineva", value: "Hirvineva" },
        { label: "Humppila", value: "Humppila" },
        { label: "Huopalahti", value: "Huopalahti" },
        { label: "Huutokoski", value: "Huutokoski" },
        { label: "Hyrkäs", value: "Hyrkäs" },
        { label: "Hyrynsalmi", value: "Hyrynsalmi" },
        { label: "Hyvinkää", value: "Hyvinkää" },
        { label: "Hämeenlinna", value: "Hämeenlinna" },
        { label: "Härmä", value: "Härmä" },
        { label: "Höljäkkä", value: "Höljäkkä" },
        { label: "Ii", value: "Ii" },
        { label: "Iisalmen teollisuusraiteet", value: "Iisalmen teollisuusraiteet" },
        { label: "Iisalmi", value: "Iisalmi" },
        { label: "Iittala", value: "Iittala" },
        { label: "Ilmala asema", value: "Ilmala asema" },
        { label: "Ilmala ratapiha", value: "Ilmala ratapiha" },
        { label: "Ilomantsi", value: "Ilomantsi" },
        { label: "IMATRA", value: "IMATRA" },
        { label: "Imatra asema", value: "Imatra asema" },
        { label: "Imatra tavara", value: "Imatra tavara" },
        { label: "Imatrankoski", value: "Imatrankoski" },
        { label: "Imatrankoski-raja", value: "Imatrankoski-raja" },
        { label: "Immola", value: "Immola" },
        { label: "Inha", value: "Inha" },
        { label: "Inkeroinen", value: "Inkeroinen" },
        { label: "Inkoo", value: "Inkoo" },
        { label: "Isokyrö", value: "Isokyrö" },
        { label: "Jalasjärvi", value: "Jalasjärvi" },
        { label: "Jepua", value: "Jepua" },
        { label: "JOENSUU", value: "JOENSUU" },
        { label: "Joensuu asema", value: "Joensuu asema" },
        { label: "Joensuu Peltola", value: "Joensuu Peltola" },
        { label: "Joensuu Sulkulahti", value: "Joensuu Sulkulahti" },
        { label: "Jokela", value: "Jokela" },
        { label: "Joroinen", value: "Joroinen" },
        { label: "Jorvas", value: "Jorvas" },
        { label: "Joutseno", value: "Joutseno" },
        { label: "Juankoski", value: "Juankoski" },
        { label: "Jutila", value: "Jutila" },
        { label: "Juupajoki", value: "Juupajoki" },
        { label: "Juurikorpi", value: "Juurikorpi" },
        { label: "Jyväskylä", value: "Jyväskylä" },
        { label: "Jämsä", value: "Jämsä" },
        { label: "Jämsänkoski", value: "Jämsänkoski" },
        { label: "Järvelä", value: "Järvelä" },
        { label: "JÄRVENPÄÄ", value: "JÄRVENPÄÄ" },
        { label: "Järvenpää asema", value: "Järvenpää asema" },
        { label: "Kaipiainen", value: "Kaipiainen" },
        { label: "Kaipola", value: "Kaipola" },
        { label: "Kaitjärvi", value: "Kaitjärvi" },
        { label: "Kajaani", value: "Kajaani" },
        { label: "Kaleton", value: "Kaleton" },
        { label: "Kaleva", value: "Kaleva" },
        { label: "Kalevan kirkko", value: "Kalevan kirkko" },
        { label: "Kalevanrinne", value: "Kalevanrinne" },
        { label: "Kalkku", value: "Kalkku" },
        { label: "Kalliovarasto", value: "Kalliovarasto" },
        { label: "Kalvitsa", value: "Kalvitsa" },
        { label: "Kangas", value: "Kangas" },
        { label: "Kannelmäki", value: "Kannelmäki" },
        { label: "Kannonkoski", value: "Kannonkoski" },
        { label: "Kannus", value: "Kannus" },
        { label: "Karhejärvi", value: "Karhejärvi" },
        { label: "Karhukangas", value: "Karhukangas" },
        { label: "Karjaa", value: "Karjaa" },
        { label: "Karkku", value: "Karkku" },
        { label: "Karviainen", value: "Karviainen" },
        { label: "Kaskinen", value: "Kaskinen" },
        { label: "Kattilaharju", value: "Kattilaharju" },
        { label: "Kauhajoki", value: "Kauhajoki" },
        { label: "Kauhava", value: "Kauhava" },
        { label: "Kauklahti", value: "Kauklahti" },
        { label: "Kaulinranta", value: "Kaulinranta" },
        { label: "Kauniainen", value: "Kauniainen" },
        { label: "Kaupin kampus", value: "Kaupin kampus" },
        { label: "Kauppilanmäki", value: "Kauppilanmäki" },
        { label: "Kausala", value: "Kausala" },
        { label: "Keitelepohja", value: "Keitelepohja" },
        { label: "Kekomäki", value: "Kekomäki" },
        { label: "Kemi", value: "Kemi" },
        { label: "Kemijärvi", value: "Kemijärvi" },
        { label: "Kempele", value: "Kempele" },
        { label: "Kera", value: "Kera" },
        { label: "KERAVA", value: "KERAVA" },
        { label: "Kerava asema", value: "Kerava asema" },
        { label: "Kerimäki", value: "Kerimäki" },
        { label: "Keskustori", value: "Keskustori" },
        { label: "Kesälahti", value: "Kesälahti" },
        { label: "Kiiala", value: "Kiiala" },
        { label: "Kilo", value: "Kilo" },
        { label: "Kilpua", value: "Kilpua" },
        { label: "Kinahmi", value: "Kinahmi" },
        { label: "Kinni", value: "Kinni" },
        { label: "Kirjola", value: "Kirjola" },
        { label: "Kirkkonummi", value: "Kirkkonummi" },
        { label: "Kirkniemi", value: "Kirkniemi" },
        { label: "Kitee", value: "Kitee" },
        { label: "Kiukainen", value: "Kiukainen" },
        { label: "Kiuruvesi", value: "Kiuruvesi" },
        { label: "Kivesjärvi", value: "Kivesjärvi" },
        { label: "Kivistö", value: "Kivistö" },
        { label: "Kohtavaara", value: "Kohtavaara" },
        { label: "Koivu", value: "Koivu" },
        { label: "Koivuhovi", value: "Koivuhovi" },
        { label: "Koivukylä", value: "Koivukylä" },
        { label: "Kokemäki", value: "Kokemäki" },
        { label: "Kokkola", value: "Kokkola" },
        { label: "Kolari", value: "Kolari" },
        { label: "Kolho", value: "Kolho" },
        { label: "Kolppi", value: "Kolppi" },
        { label: "Kommila", value: "Kommila" },
        { label: "Komu", value: "Komu" },
        { label: "Kontiolahti", value: "Kontiolahti" },
        { label: "Kontiomäki", value: "Kontiomäki" },
        { label: "Koria", value: "Koria" },
        { label: "Korkeakoski", value: "Korkeakoski" },
        { label: "Korso", value: "Korso" },
        { label: "Korvensuo", value: "Korvensuo" },
        { label: "Koskenkorva", value: "Koskenkorva" },
        { label: "Koskipuisto", value: "Koskipuisto" },
        { label: "Kotka asema", value: "Kotka asema" },
        { label: "Kotka Hovinsaari", value: "Kotka Hovinsaari" },
        { label: "Kotka Mussalo", value: "Kotka Mussalo" },
        { label: "Kotka tavara", value: "Kotka tavara" },
        { label: "Kotkan satama", value: "Kotkan satama" },
        { label: "Kotolahti", value: "Kotolahti" },
        { label: "KOUVOLA", value: "KOUVOLA" },
        { label: "Kouvola asema", value: "Kouvola asema" },
        { label: "Kouvola lajittelu", value: "Kouvola lajittelu" },
        { label: "Kouvola Oikoraide", value: "Kouvola Oikoraide" },
        { label: "Kouvola tavara", value: "Kouvola tavara" },
        { label: "Kovjoki", value: "Kovjoki" },
        { label: "Kruunupyy", value: "Kruunupyy" },
        { label: "Kuivasjärvi", value: "Kuivasjärvi" },
        { label: "Kullasvaara", value: "Kullasvaara" },
        { label: "KUOPIO", value: "KUOPIO" },
        { label: "Kuopio asema", value: "Kuopio asema" },
        { label: "Kuopio tavara", value: "Kuopio tavara" },
        { label: "Kupittaa", value: "Kupittaa" },
        { label: "Kurkimäki", value: "Kurkimäki" },
        { label: "Kuurila", value: "Kuurila" },
        { label: "Kuusankoski", value: "Kuusankoski" },
        { label: "Kylänlahti", value: "Kylänlahti" },
        { label: "Kymi", value: "Kymi" },
        { label: "Kyminlinna", value: "Kyminlinna" },
        { label: "Kyrö", value: "Kyrö" },
        { label: "Kytömaa", value: "Kytömaa" },
        { label: "Kälviä", value: "Kälviä" },
        { label: "Käpylä", value: "Käpylä" },
        { label: "Köykkäri", value: "Köykkäri" },
        { label: "Laajavuori", value: "Laajavuori" },
        { label: "Lahdenperä", value: "Lahdenperä" },
        { label: "Lahnaslampi", value: "Lahnaslampi" },
        { label: "Lahti", value: "Lahti" },
        { label: "Laihia", value: "Laihia" },
        { label: "Lakiala", value: "Lakiala" },
        { label: "Lamminkoski", value: "Lamminkoski" },
        { label: "Lamminniemi", value: "Lamminniemi" },
        { label: "Lapinjärvi", value: "Lapinjärvi" },
        { label: "Lapinlahti", value: "Lapinlahti" },
        { label: "Lapinneva", value: "Lapinneva" },
        { label: "Lappeenranta", value: "Lappeenranta" },
        { label: "Lappila", value: "Lappila" },
        { label: "Lappohja", value: "Lappohja" },
        { label: "Lapua", value: "Lapua" },
        { label: "Larvakytö", value: "Larvakytö" },
        { label: "Laukaa", value: "Laukaa" },
        { label: "Laurila", value: "Laurila" },
        { label: "Lauritsala", value: "Lauritsala" },
        { label: "Lautiosaari", value: "Lautiosaari" },
        { label: "Leinelä", value: "Leinelä" },
        { label: "Lelkola", value: "Lelkola" },
        { label: "Lempäälä", value: "Lempäälä" },
        { label: "Lentoasema", value: "Lentoasema" },
        { label: "Leppäkoski", value: "Leppäkoski" },
        { label: "Leppävaara", value: "Leppävaara" },
        { label: "Leteensuo", value: "Leteensuo" },
        { label: "Lieksa", value: "Lieksa" },
        { label: "Lieksan teollisuuskylä", value: "Lieksan teollisuuskylä" },
        { label: "Lielahti", value: "Lielahti" },
        { label: "Lievestuore", value: "Lievestuore" },
        { label: "Liminka", value: "Liminka" },
        { label: "Liminpuro", value: "Liminpuro" },
        { label: "Lohiluoma", value: "Lohiluoma" },
        { label: "Lohja", value: "Lohja" },
        { label: "Loimaa", value: "Loimaa" },
        { label: "Louhela", value: "Louhela" },
        { label: "Loukolampi", value: "Loukolampi" },
        { label: "Loviisa satama", value: "Loviisa satama" },
        { label: "Luikonlahti", value: "Luikonlahti" },
        { label: "Lusto", value: "Lusto" },
        { label: "Luumäki", value: "Luumäki" },
        { label: "Länkipohja", value: "Länkipohja" },
        { label: "Maaria", value: "Maaria" },
        { label: "Madesjärvi", value: "Madesjärvi" },
        { label: "Majajärvi", value: "Majajärvi" },
        { label: "Malmi", value: "Malmi" },
        { label: "Malminkartano", value: "Malminkartano" },
        { label: "Mankala", value: "Mankala" },
        { label: "Markkala", value: "Markkala" },
        { label: "Martinlaakso", value: "Martinlaakso" },
        { label: "Masala", value: "Masala" },
        { label: "Matkaneva", value: "Matkaneva" },
        { label: "Mattila", value: "Mattila" },
        { label: "Melalahti", value: "Melalahti" },
        { label: "Metsäkansa", value: "Metsäkansa" },
        { label: "Mikkeli", value: "Mikkeli" },
        { label: "Misi", value: "Misi" },
        { label: "Mommila", value: "Mommila" },
        { label: "Muhos", value: "Muhos" },
        { label: "Mukkula", value: "Mukkula" },
        { label: "Murtomäki", value: "Murtomäki" },
        { label: "Mustio", value: "Mustio" },
        { label: "Mustolan satama", value: "Mustolan satama" },
        { label: "Muukko", value: "Muukko" },
        { label: "Muurame", value: "Muurame" },
        { label: "Muurola", value: "Muurola" },
        { label: "Myllykangas", value: "Myllykangas" },
        { label: "Myllykoski", value: "Myllykoski" },
        { label: "Myllymäki", value: "Myllymäki" },
        { label: "Myllyoja", value: "Myllyoja" },
        { label: "Mynttilä", value: "Mynttilä" },
        { label: "Mynämäki", value: "Mynämäki" },
        { label: "Myyrmäki", value: "Myyrmäki" },
        { label: "Mäkkylä", value: "Mäkkylä" },
        { label: "Mäntsälä", value: "Mäntsälä" },
        { label: "Mänttä", value: "Mänttä" },
        { label: "Mäntyharju", value: "Mäntyharju" },
        { label: "Mäntyluoto", value: "Mäntyluoto" },
        { label: "Naantali", value: "Naantali" },
        { label: "Naarajärvi", value: "Naarajärvi" },
        { label: "Nakkila", value: "Nakkila" },
        { label: "Nastola", value: "Nastola" },
        { label: "Niemenpää", value: "Niemenpää" },
        { label: "Niinimaa", value: "Niinimaa" },
        { label: "Niinimäki", value: "Niinimäki" },
        { label: "Niinisalo", value: "Niinisalo" },
        { label: "Niirala", value: "Niirala" },
        { label: "Niirala-raja", value: "Niirala-raja" },
        { label: "Niittylahti", value: "Niittylahti" },
        { label: "Nikkilä", value: "Nikkilä" },
        { label: "Niska", value: "Niska" },
        { label: "Nivala", value: "Nivala" },
        { label: "Nokia", value: "Nokia" },
        { label: "Nummela", value: "Nummela" },
        { label: "Nurmes", value: "Nurmes" },
        { label: "Närpiö", value: "Närpiö" },
        { label: "Ohenmäki", value: "Ohenmäki" },
        { label: "Oitti", value: "Oitti" },
        { label: "Olli", value: "Olli" },
        { label: "Onttola", value: "Onttola" },
        { label: "Opiskelija", value: "Opiskelija" },
        { label: "Orimattila", value: "Orimattila" },
        { label: "Orivesi", value: "Orivesi" },
        { label: "Orivesi keskusta", value: "Orivesi keskusta" },
        { label: "Otanmäki", value: "Otanmäki" },
        { label: "Otava", value: "Otava" },
        { label: "Oulainen", value: "Oulainen" },
        { label: "OULU", value: "OULU" },
        { label: "Oulu asema", value: "Oulu asema" },
        { label: "Oulu Nokela", value: "Oulu Nokela" },
        { label: "Oulu tavara", value: "Oulu tavara" },
        { label: "Oulu Tuira", value: "Oulu Tuira" },
        { label: "Oulunkylä", value: "Oulunkylä" },
        { label: "Oulunlahti", value: "Oulunlahti" },
        { label: "Paimenportti", value: "Paimenportti" },
        { label: "Paimio", value: "Paimio" },
        { label: "Palopuro", value: "Palopuro" },
        { label: "Paltamo", value: "Paltamo" },
        { label: "Pankakoski", value: "Pankakoski" },
        { label: "Parikkala", value: "Parikkala" },
        { label: "Parkano", value: "Parkano" },
        { label: "Parola", value: "Parola" },
        { label: "Pasila asema", value: "Pasila asema" },
        { label: "Pasila autojuna-asema", value: "Pasila autojuna-asema" },
        { label: "Pasila tavara", value: "Pasila tavara" },
        { label: "Pelkola", value: "Pelkola" },
        { label: "Pello", value: "Pello" },
        { label: "Peltosalmi", value: "Peltosalmi" },
        { label: "Peräseinäjoki", value: "Peräseinäjoki" },
        { label: "Pesiökylä", value: "Pesiökylä" },
        { label: "Petäjävesi", value: "Petäjävesi" },
        { label: "PIEKSÄMÄKI", value: "PIEKSÄMÄKI" },
        { label: "Pieksämäki asema", value: "Pieksämäki asema" },
        { label: "Pieksämäki lajittelu", value: "Pieksämäki lajittelu" },
        { label: "Pieksämäki tavara", value: "Pieksämäki tavara" },
        { label: "Pieksämäki Temu", value: "Pieksämäki Temu" },
        { label: "Pietarsaari", value: "Pietarsaari" },
        { label: "Pihlajavesi", value: "Pihlajavesi" },
        { label: "Pihtipudas", value: "Pihtipudas" },
        { label: "Piikkiö", value: "Piikkiö" },
        { label: "Pikkarala", value: "Pikkarala" },
        { label: "Pitkämäki", value: "Pitkämäki" },
        { label: "Pitäjänmäki", value: "Pitäjänmäki" },
        { label: "Pohjankuru", value: "Pohjankuru" },
        { label: "Pohjois-Haaga", value: "Pohjois-Haaga" },
        { label: "Pohjois-Hervanta", value: "Pohjois-Hervanta" },
        { label: "Pohjois-Louko", value: "Pohjois-Louko" },
        { label: "Poikkeus", value: "Poikkeus" },
        { label: "Poiksilta", value: "Poiksilta" },
        { label: "Pori", value: "Pori" },
        { label: "Porvoo", value: "Porvoo" },
        { label: "Puhos", value: "Puhos" },
        { label: "Puistola", value: "Puistola" },
        { label: "Pukinmäki", value: "Pukinmäki" },
        { label: "Pulsa", value: "Pulsa" },
        { label: "Punkaharju", value: "Punkaharju" },
        { label: "Purola", value: "Purola" },
        { label: "Pyhäkumpu", value: "Pyhäkumpu" },
        { label: "Pyhäkumpu erkanemisvaihde", value: "Pyhäkumpu erkanemisvaihde" },
        { label: "Pyynikintori", value: "Pyynikintori" },
        { label: "Pännäinen", value: "Pännäinen" },
        { label: "Pääskylahti", value: "Pääskylahti" },
        { label: "Raahe", value: "Raahe" },
        { label: "Raippo", value: "Raippo" },
        { label: "Raisio", value: "Raisio" },
        { label: "Rajamäki", value: "Rajamäki" },
        { label: "Rajaperkiö", value: "Rajaperkiö" },
        { label: "Rantasalmi", value: "Rantasalmi" },
        { label: "Rasinsuo", value: "Rasinsuo" },
        { label: "Ratikylä", value: "Ratikylä" },
        { label: "Rauha", value: "Rauha" },
        { label: "Rauhalahti", value: "Rauhalahti" },
        { label: "Rauma", value: "Rauma" },
        { label: "Raunio", value: "Raunio" },
        { label: "Rautaruukki", value: "Rautaruukki" },
        { label: "Rautatieasema", value: "Rautatieasema" },
        { label: "Rautjärvi", value: "Rautjärvi" },
        { label: "Rautpohja", value: "Rautpohja" },
        { label: "Rekola", value: "Rekola" },
        { label: "Retretti", value: "Retretti" },
        { label: "Riihimäki Arolampi", value: "Riihimäki Arolampi" },
        { label: "Riihimäki asema", value: "Riihimäki asema" },
        { label: "Riihimäki lajittelu", value: "Riihimäki lajittelu" },
        { label: "Riihimäki tavara", value: "Riihimäki tavara" },
        { label: "Riijärvi", value: "Riijärvi" },
        { label: "Riippa", value: "Riippa" },
        { label: "Ristiina", value: "Ristiina" },
        { label: "Ristijärvi", value: "Ristijärvi" },
        { label: "Rovaniemi", value: "Rovaniemi" },
        { label: "Ruha", value: "Ruha" },
        { label: "Runni", value: "Runni" },
        { label: "Ruokosuo", value: "Ruokosuo" },
        { label: "Ruukki", value: "Ruukki" },
        { label: "Ruusumäki", value: "Ruusumäki" },
        { label: "Ryttylä", value: "Ryttylä" },
        { label: "Röyttä", value: "Röyttä" },
        { label: "Saakoski", value: "Saakoski" },
        { label: "Saari", value: "Saari" },
        { label: "Saarijärvi", value: "Saarijärvi" },
        { label: "Salminen", value: "Salminen" },
        { label: "Salo", value: "Salo" },
        { label: "Sammalisto", value: "Sammalisto" },
        { label: "Sammonaukio", value: "Sammonaukio" },
        { label: "Santala", value: "Santala" },
        { label: "Saunakallio", value: "Saunakallio" },
        { label: "Saunamäki", value: "Saunamäki" },
        { label: "Savio", value: "Savio" },
        { label: "Savonlinna asema", value: "Savonlinna asema" },
        { label: "SEINÄJOKI", value: "SEINÄJOKI" },
        { label: "Seinäjoki asema", value: "Seinäjoki asema" },
        { label: "Seinäjoki tavara", value: "Seinäjoki tavara" },
        { label: "Selänpää", value: "Selänpää" },
        { label: "Sieppijärvi", value: "Sieppijärvi" },
        { label: "Sievi", value: "Sievi" },
        { label: "Siikamäki", value: "Siikamäki" },
        { label: "SIILINJÄRVI", value: "SIILINJÄRVI" },
        { label: "Siilinjärvi asema", value: "Siilinjärvi asema" },
        { label: "Siilinjärvi kaivos", value: "Siilinjärvi kaivos" },
        { label: "Simo", value: "Simo" },
        { label: "Simpele", value: "Simpele" },
        { label: "Sipilä", value: "Sipilä" },
        { label: "Sisättö", value: "Sisättö" },
        { label: "Siuntio", value: "Siuntio" },
        { label: "Siuro", value: "Siuro" },
        { label: "Skogby", value: "Skogby" },
        { label: "Sköldvik", value: "Sköldvik" },
        { label: "Soinlahti", value: "Soinlahti" },
        { label: "Sorin aukio", value: "Sorin aukio" },
        { label: "Sorsasalo", value: "Sorsasalo" },
        { label: "Sukeva", value: "Sukeva" },
        { label: "Suolahti", value: "Suolahti" },
        { label: "Suonenjoki", value: "Suonenjoki" },
        { label: "Suoniemi", value: "Suoniemi" },
        { label: "Syrjä", value: "Syrjä" },
        { label: "Syrjämäki", value: "Syrjämäki" },
        { label: "Sysmäjärvi", value: "Sysmäjärvi" },
        { label: "Säkäniemi", value: "Säkäniemi" },
        { label: "Sänkimäki", value: "Sänkimäki" },
        { label: "Sääksjärvi", value: "Sääksjärvi" },
        { label: "Taavetti", value: "Taavetti" },
        { label: "Taipale", value: "Taipale" },
        { label: "Talviainen", value: "Talviainen" },
        { label: "Talvivaara", value: "Talvivaara" },
        { label: "Tammisaari", value: "Tammisaari" },
        { label: "TAMPERE", value: "TAMPERE" },
        { label: "Tampere asema", value: "Tampere asema" },
        { label: "Tampere Järvensivu", value: "Tampere Järvensivu" },
        { label: "Tampere tavara", value: "Tampere tavara" },
        { label: "Tampere Viinikka", value: "Tampere Viinikka" },
        { label: "Tapanila", value: "Tapanila" },
        { label: "Tapavainola", value: "Tapavainola" },
        { label: "Tavastila", value: "Tavastila" },
        { label: "Tays", value: "Tays" },
        { label: "Tervajoki", value: "Tervajoki" },
        { label: "Tervola", value: "Tervola" },
        { label: "Teuva", value: "Teuva" },
        { label: "Tikkala", value: "Tikkala" },
        { label: "Tikkaperä", value: "Tikkaperä" },
        { label: "TIKKURILA", value: "TIKKURILA" },
        { label: "Tikkurila asema", value: "Tikkurila asema" },
        { label: "Tohmajärvi", value: "Tohmajärvi" },
        { label: "Toijala", value: "Toijala" },
        { label: "Toivala", value: "Toivala" },
        { label: "Tolsa", value: "Tolsa" },
        { label: "Tommola", value: "Tommola" },
        { label: "Torkkeli", value: "Torkkeli" },
        { label: "Tornio asema", value: "Tornio asema" },
        { label: "Tornio-Itäinen", value: "Tornio-Itäinen" },
        { label: "Tornio-raja", value: "Tornio-raja" },
        { label: "Tulli", value: "Tulli" },
        { label: "Tuomarila", value: "Tuomarila" },
        { label: "Tuomioja", value: "Tuomioja" },
        { label: "Turenki", value: "Turenki" },
        { label: "TURKU", value: "TURKU" },
        { label: "Turku asema", value: "Turku asema" },
        { label: "Turku satama", value: "Turku satama" },
        { label: "Turku tavara", value: "Turku tavara" },
        { label: "Turtola", value: "Turtola" },
        { label: "Tuulensuu", value: "Tuulensuu" },
        { label: "Tuupovaara", value: "Tuupovaara" },
        { label: "Tuuri", value: "Tuuri" },
        { label: "Törmä", value: "Törmä" },
        { label: "Törölä", value: "Törölä" },
        { label: "Uimaharju", value: "Uimaharju" },
        { label: "Uintikeskus", value: "Uintikeskus" },
        { label: "Urjala", value: "Urjala" },
        { label: "Utajärvi", value: "Utajärvi" },
        { label: "Utti", value: "Utti" },
        { label: "Uusikaupunki", value: "Uusikaupunki" },
        { label: "Uusikylä", value: "Uusikylä" },
        { label: "Vaajakoski", value: "Vaajakoski" },
        { label: "Vaala", value: "Vaala" },
        { label: "Vaarala", value: "Vaarala" },
        { label: "Vaasa", value: "Vaasa" },
        { label: "Vahojärvi", value: "Vahojärvi" },
        { label: "VAINIKKALA", value: "VAINIKKALA" },
        { label: "Vainikkala asema", value: "Vainikkala asema" },
        { label: "Vainikkala tavara", value: "Vainikkala tavara" },
        { label: "Vainikkala-raja", value: "Vainikkala-raja" },
        { label: "Valimo", value: "Valimo" },
        { label: "Valkeakoski", value: "Valkeakoski" },
        { label: "Valkeasuo", value: "Valkeasuo" },
        { label: "Vammala", value: "Vammala" },
        { label: "Vanattara", value: "Vanattara" },
        { label: "Vantaankoski", value: "Vantaankoski" },
        { label: "Varkaus", value: "Varkaus" },
        { label: "Vartius", value: "Vartius" },
        { label: "Vartius-raja", value: "Vartius-raja" },
        { label: "Vasikkahaka", value: "Vasikkahaka" },
        { label: "Vaskiluoto", value: "Vaskiluoto" },
        { label: "Vehkala", value: "Vehkala" },
        { label: "Venetmäki", value: "Venetmäki" },
        { label: "Vesanka", value: "Vesanka" },
        { label: "Viekki", value: "Viekki" },
        { label: "Vierumäki", value: "Vierumäki" },
        { label: "Vihanti", value: "Vihanti" },
        { label: "Vihtari", value: "Vihtari" },
        { label: "Vihtavuori", value: "Vihtavuori" },
        { label: "Viiala", value: "Viiala" },
        { label: "Viinijärvi", value: "Viinijärvi" },
        { label: "Villähde", value: "Villähde" },
        { label: "Vilppula", value: "Vilppula" },
        { label: "Vinnilä", value: "Vinnilä" },
        { label: "Virkamies", value: "Virkamies" },
        { label: "Voltti", value: "Voltti" },
        { label: "Vuohijärvi", value: "Vuohijärvi" },
        { label: "Vuojoki", value: "Vuojoki" },
        { label: "Vuokatti", value: "Vuokatti" },
        { label: "Vuonislahti", value: "Vuonislahti" },
        { label: "Vuosaari", value: "Vuosaari" },
        { label: "YKSPIHLAJA", value: "YKSPIHLAJA" },
        { label: "Ykspihlaja tavara", value: "Ykspihlaja tavara" },
        { label: "Ykspihlaja väliratapiha", value: "Ykspihlaja väliratapiha" },
        { label: "Ylistaro", value: "Ylistaro" },
        { label: "Ylitornio", value: "Ylitornio" },
        { label: "Ylivalli", value: "Ylivalli" },
        { label: "Ylivieska", value: "Ylivieska" },
        { label: "Ylämylly", value: "Ylämylly" },
        { label: "Ylöjärvi", value: "Ylöjärvi" },
        { label: "Ypykkävaara", value: "Ypykkävaara" },
        { label: "Äetsä", value: "Äetsä" },
        { label: "Ähtäri", value: "Ähtäri" },
        { label: "Ämmänsaari", value: "Ämmänsaari" },
        { label: "Äänekoski", value: "Äänekoski" }
    ]);

    const [option21Open, setOption21Open] = useState(false);
    const [option21Items, setOption21Items] = useState([
        { label: "Lähiliikenne A", value: "Lähiliikenne A" },
        { label: "Lähiliikenne D", value: "Lähiliikenne D" },
        { label: "Lähiliikenne E", value: "Lähiliikenne E" },
        { label: "Lähiliikenne G", value: "Lähiliikenne G" },
        { label: "Lähiliikenne H", value: "Lähiliikenne H" },
        { label: "Lähiliikenne I", value: "Lähiliikenne I" },
        { label: "Lähiliikenne K", value: "Lähiliikenne K" },
        { label: "Lähiliikenne L", value: "Lähiliikenne L" },
        { label: "Lähiliikenne M", value: "Lähiliikenne M" },
        { label: "Lähiliikenne P", value: "Lähiliikenne P" },
        { label: "Lähiliikenne R", value: "Lähiliikenne R" },
        { label: "Lähiliikenne T", value: "Lähiliikenne T" },
        { label: "Lähiliikenne U", value: "Lähiliikenne U" },
        { label: "Lähiliikenne V", value: "Lähiliikenne V" },
        { label: "Lähiliikenne X", value: "Lähiliikenne X" },
        { label: "Lähiliikenne Y", value: "Lähiliikenne Y" },
        { label: "Lähiliikenne Z", value: "Lähiliikenne Z" },
    ]);

    // Option 3:
    const [option3Open, setOption3Open] = useState(false);
    const [option3VRItems, setOption3VRItems] = useState([
        { label: "Kalusto/ajoneuvo", value: "1" },
        { label: "Ravintola/kioski", value: "2" },
        { label: "Varikko/konepaja/korjaamo", value: "3" },
        { label: "Kiinteistö/toimisto/varasto", value: "4" },
        { label: "Asema/pysäkki/laiturialueet", value: "5" },
        { label: "Tiealue", value: "6" },
        { label: "Rautatiealue", value: "7" },
        { label: "Terminaali/satama/kuormauspaikka", value: "8" },
        { label: "Piha-alue", value: "9" },
        { label: "Muu", value: "99" },
    ]);
    const [option3Items, setOption3Items] = useState([
        { label: "Ajoneuvo", value: "PL1" },
        { label: "Varikko", value: "PL2" },
        { label: "Pysäkki", value: "PL3" },
        { label: "Tiealue", value: "PL4" },
        { label: "Muu", value: "PL99" },
    ]);

    // Option 6:

    const handleSubstanceTargetChange = (key) => {
        updateBreachData('substanceTarget', {
            value: {
                ...breachData.substanceTarget.value,
                [key]: !breachData.substanceTarget.value[key],
            },
            error: '',
        })
    };
    // Option 9:
    const [option9Open, setOption9Open] = useState(false);
    const [option9Items, setOption9Items] = useState([
        { label: "Ajoneuvo", value: "Ajoneuvo" },
        { label: "Varikko", value: "Varikko" },
        { label: "Pysäkki", value: "Pysäkki" },
        { label: "Tiealue", value: "Tiealue" },
        { label: "Muu", value: "Muu" },
    ]);

    // Options for the Pysäkin tunnus listasta
    const [optionStopIdItems, setOptionStopIdItems] = useState([
        { label: "Etelä-Hervanta", value: "Etelä-Hervanta" },
        { label: "Hakametsä", value: "Hakametsä" },
        { label: "Hallila", value: "Hallila" },
        { label: "Hervantajärvi", value: "Hervantajärvi" },
        { label: "Hervannan kampus", value: "Hervannan kampus" },
        { label: "Hervantakeskus", value: "Hervantakeskus" },
        { label: "Hippos", value: "Hippos" },
        { label: "Kaleva", value: "Kaleva" },
        { label: "Kalevan kirkko", value: "Kalevan kirkko" },
        { label: "Kalevanrinne", value: "Kalevanrinne" },
        { label: "Kaupin kampus", value: "Kaupin kampus" },
        { label: "Keskustori", value: "Keskustori" },
        { label: "Koskipuisto", value: "Koskipuisto" },
        { label: "Lentävänniemi", value: "Lentävänniemi" },
        { label: "Opiskelija", value: "Opiskelija" },
        { label: "Pohjois-Hervanta", value: "Pohjois-Hervanta" },
        { label: "Pyynikintori", value: "Pyynikintori" },
        { label: "Rautatieasema", value: "Rautatieasema" },
        { label: "Sammonaukio", value: "Sammonaukio" },
        { label: "Särkänniemi", value: "Särkänniemi" },
        { label: "Santalahti", value: "Santalahti" },
        { label: "Sorin aukio", value: "Sorin aukio" },
        { label: "Tays", value: "Tays" },
        { label: "Tikkutehdas", value: "Tikkutehdas" },
        { label: "Tulli", value: "Tulli" },
        { label: "Tuulensuu", value: "Tuulensuu" },
        { label: "Turtola", value: "Turtola" },
        { label: "Uintikeskus", value: "Uintikeskus" },
    ]);
    const [optionStopIdOpen, setOptionStopIdOpen] = useState(false);

    // Common Sets for Information Details
    const path = 5;
    const [activeStep, setActiveStep] = useState(0);

    const takePhoto = async () => {
        navigation.navigate('CameraPreview', {
            path: path,
            title: title,
        });
    };

    useEffect(() => {
        if (route.params?.uri) {
            try {
                const newFile = {
                    uri: route.params.uri,
                    name: route.params.filename || route.params.uri.split('/').pop(),
                    file: route.params.file,
                    type: route.params.mimeType || 'image/jpeg',
                    size: route.params.fileSize,
                    timestamp: route.params.timestamp
                };

                addFile(newFile, path);
            } catch (error) {
                console.error('Error processing new file:', error);
                showToast("Error", "Kuvan tallennus epäonnistui", "error");
            }
        }
    }, [route.params?.uri]);

    const handlePrevious = () => {
        if (activeStep === 2 && title && title.startsWith("PL")) {
            setActiveStep(0);
        }
        else if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    }

    const handleNext = () => {
        if (activeStep === 0) {
            let validFlag = true;
            if (breachData.description.value === '') {
                updateBreachData('description', { value: '', error: 'Tämä kenttä ei voi olla tyhjä' });
                validFlag = false;
            }

            if (!breachData.dateHappened.value) {
                updateBreachData('dateHappened', {
                    ...breachData.dateHappened,
                    error: "Pakollinen tieto puuttuu..."
                })
                validFlag = false;
            }

            if (!breachData.timeHappened.value) {
                updateBreachData('timeHappened', {
                    ...breachData.timeHappened,
                    error: "Pakollinen tieto puuttuu..."
                })
                validFlag = false;
            }

            if (!validFlag) {
                return;
            }
        }
        if (activeStep === 2) {
            let validFlag = true;
            if (breachData.safetyCategory.value === 'Matkustajaturvallisuus') {

                if (!breachData.incidentType.value) {
                    validFlag = false;
                    updateBreachData('incidentType', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (breachData.incidentType.value === 'Järjestyshäiriö') {
                    if (!breachData.eventLocation.value) {
                        validFlag = false;
                        updateBreachData('eventLocation', {
                            ...breachData.eventLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.disturbanceOccured.value) {
                        validFlag = false;
                        updateBreachData('disturbanceOccured', {
                            ...breachData.disturbanceOccured,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (breachData.disturbanceOccured.value === 'Kaluston ulkopuolella' && 
                        !breachData.locationDetails.value
                    ) {
                        validFlag = false;
                        updateBreachData('locationDetails', {
                            ...breachData.locationDetails,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.hasToolsInPossession.value) {
                        validFlag = false;
                        updateBreachData('hasToolsInPossession', {
                            ...breachData.hasToolsInPossession,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                } else if (breachData.incidentType.value === 'Matkustajalle sattunut vahinko') {
                    if (!breachData.eventLocation.value) {
                        validFlag = false;
                        updateBreachData('eventLocation', {
                            ...breachData.eventLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.injuryType.value) {
                        validFlag = false;
                        updateBreachData('injuryType', {
                            ...breachData.injuryType,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.trafficSituation.value) {
                        validFlag = false;
                        updateBreachData('trafficSituation', {
                            ...breachData.trafficSituation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.passengerAction.value) {
                        validFlag = false;
                        updateBreachData('passengerAction', {
                            ...breachData.passengerAction,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.doorJam.value) {
                        validFlag = false;
                        updateBreachData('doorJam', {
                            ...breachData.doorJam,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.platformFall.value) {
                        validFlag = false;
                        updateBreachData('platformFall', {
                            ...breachData.platformFall,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                } else if (breachData.incidentType.value === 'Väkivaltatilanne') {
                    if (!breachData.eventLocation.value) {
                        validFlag = false;
                        updateBreachData('eventLocation', {
                            ...breachData.eventLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.violenceType.value) {
                        validFlag = false;
                        updateBreachData('violenceType', {
                            ...breachData.violenceType,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.propertyDamageLocation.value) {
                        validFlag = false;
                        updateBreachData('propertyDamageLocation', {
                            ...breachData.propertyDamageLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    
                    if (breachData.propertyDamageLocation.value === 'Kaluston ulkopuolella' && 
                        !breachData.locationDetails.value
                    ) {
                        validFlag = false;
                        updateBreachData('locationDetails', {
                            ...breachData.locationDetails,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }

                    if (!breachData.hasToolsUsed.value) {
                        validFlag = false;
                        updateBreachData('hasToolsUsed', {
                            ...breachData.hasToolsUsed,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                } else if (breachData.incidentType.value === 'Omaisuusvahinko') {
                    if (!breachData.eventLocation.value) {
                        validFlag = false;
                        updateBreachData('eventLocation', {
                            ...breachData.eventLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.damageType.value) {
                        validFlag = false;
                        updateBreachData('damageType', {
                            ...breachData.damageType,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.propertyDamageLocation.value) {
                        validFlag = false;
                        updateBreachData('propertyDamageLocation', {
                            ...breachData.propertyDamageLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    
                    if (breachData.propertyDamageLocation.value === 'Kaluston ulkopuolella' && 
                        !breachData.locationDetails.value
                    ) {
                        validFlag = false;
                        updateBreachData('locationDetails', {
                            ...breachData.locationDetails,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                } else if (breachData.incidentType.value === 'Ilkivalta') {
                    if (!breachData.eventLocation.value) {
                        validFlag = false;
                        updateBreachData('eventLocation', {
                            ...breachData.eventLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                } else if (breachData.incidentType.value === 'Liputtoman matkustajan häiriötön poisto') {
                    if (!breachData.eventLocation.value) {
                        validFlag = false;
                        updateBreachData('eventLocation', {
                            ...breachData.eventLocation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                }
            }
            else if (breachData.safetyCategory.value === 'Rautatieturvallisuus') {
                if (!breachData.option2Value.value) {
                    validFlag = false;
                    updateBreachData('option2Value', {
                        ...breachData.option2Value,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.owner.value) {
                    validFlag = false;
                    updateBreachData('owner', {
                        ...breachData.owner,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.eventType.value) {
                    validFlag = false;
                    updateBreachData('eventType', {
                        ...breachData.eventType,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.safetyDeviceElement.value) {
                    validFlag = false;
                    updateBreachData('safetyDeviceElement', {
                        ...breachData.safetyDeviceElement,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }

                if (breachData.safetyDeviceElement.value !== "Ei valintaa" && breachData.safetyDeviceElement.value !== "" && !breachData.identifier.value) {
                    validFlag = false;
                    updateBreachData('identifier', {
                        ...breachData.identifier,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }

                if (!breachData.unitIdentifier.value) {
                    validFlag = false;
                    updateBreachData('unitIdentifier', {
                        ...breachData.unitIdentifier,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.trafficMode.value) {
                    validFlag = false;
                    updateBreachData('trafficMode', {
                        ...breachData.trafficMode,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }
            else if (breachData.safetyCategory.value === 'Ratikkaturvallisuus') {
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.routeId.value) {
                    validFlag = false;
                    updateBreachData('routeId', {
                        ...breachData.routeId,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.equipmentID.value) {
                    validFlag = false;
                    updateBreachData('equipmentID', {
                        ...breachData.equipmentID,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }
            else if (breachData.safetyCategory.value === 'Tietoturvallisuus') {
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }
            else if (breachData.safetyCategory.value === 'Toimitilaturvallisuus') {
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }
            else if (breachData.safetyCategory.value === 'Ympäristöturvallisuus') {
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.substanceName.value) {
                    validFlag = false;
                    updateBreachData('substanceName', {
                        ...breachData.substanceName,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.substanceTarget.value.soilOrWater &&
                    !breachData.substanceTarget.value.air &&
                    !breachData.substanceTarget.value.sewage
                ) {
                    validFlag = false;
                    updateBreachData('substanceTarget', {
                        ...breachData.substanceTarget,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.ykNumber.value) {
                    validFlag = false;
                    updateBreachData('ykNumber', {
                        ...breachData.ykNumber,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.substanceAmountEstimate.value) {
                    validFlag = false;
                    updateBreachData('substanceAmountEstimate', {
                        ...breachData.substanceAmountEstimate,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }
            else if (breachData.safetyCategory.value === 'Kalustoturvallisuus') {
                if (!breachData.option2Value.value) {
                    validFlag = false;
                    updateBreachData('option2Value', {
                        ...breachData.option2Value,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.eventType.value) {
                    validFlag = false;
                    updateBreachData('eventType', {
                        ...breachData.eventType,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.trafficType.value) {
                    validFlag = false;
                    updateBreachData('trafficType', {
                        ...breachData.trafficType,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.vehicleType.value) {
                    validFlag = false;
                    updateBreachData('vehicleType', {
                        ...breachData.vehicleType,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.vehicleSeries.value) {
                    validFlag = false;
                    updateBreachData('vehicleSeries', {
                        ...breachData.vehicleSeries,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.vehicleNumber.value) {
                    validFlag = false;
                    updateBreachData('vehicleNumber', {
                        ...breachData.vehicleNumber,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }
            else if (breachData.safetyCategory.value === 'PL Matkustajaturvallisuus') {
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (breachData.incidentType.value === 'Väkivaltatilanne') {
                    if (!breachData.violenceType.value) {
                        validFlag = false;
                        updateBreachData('violenceType', {
                            ...breachData.violenceType,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.influence.value) {
                        validFlag = false;
                        updateBreachData('influence', {
                            ...breachData.influence,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.hasToolsUsed.value) {
                        validFlag = false;
                        updateBreachData('hasToolsUsed', {
                            ...breachData.hasToolsUsed,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.firstAidGiven.value) {
                        validFlag = false;
                        updateBreachData('firstAidGiven', {
                            ...breachData.firstAidGiven,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                }
                if (breachData.incidentType.value === 'Matkustajalle sattunut vahinko') {
                    if (!breachData.injuryType.value) {
                        validFlag = false;
                        updateBreachData('injuryType', {
                            ...breachData.injuryType,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.influence.value) {
                        validFlag = false;
                        updateBreachData('influence', {
                            ...breachData.influence,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.trafficSituation.value) {
                        validFlag = false;
                        updateBreachData('trafficSituation', {
                            ...breachData.trafficSituation,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.passengerAction.value) {
                        validFlag = false;
                        updateBreachData('passengerAction', {
                            ...breachData.passengerAction,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.doorJam.value) {
                        validFlag = false;
                        updateBreachData('doorJam', {
                            ...breachData.doorJam,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    // if (!breachData.platformFall.value) {
                    //     validFlag = false;
                    //     updateBreachData('platformFall', {
                    //         ...breachData.platformFall,
                    //         error: 'Pakollinen tieto puuttuu...'
                    //     });
                    // }
                    if (!breachData.option3Value.value) {
                        validFlag = false;
                        updateBreachData('option3Value', {
                            ...breachData.option3Value,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                }
                if (breachData.incidentType.value === 'Omaisuusvahinko') {
                    if (!breachData.damageType.value) {
                        validFlag = false;
                        updateBreachData('damageType', {
                            ...breachData.damageType,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                    if (!breachData.option3Value.value) {
                        validFlag = false;
                        updateBreachData('option3Value', {
                            ...breachData.option3Value,
                            error: 'Pakollinen tieto puuttuu...'
                        });
                    }
                }
            }
            if (breachData.safetyCategory.value === 'PL Tieliikenneturvallisuus') {
                if (!breachData.eventNature.value) {
                    validFlag = false;
                    updateBreachData('eventNature', {
                        ...breachData.eventNature,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.city.value) {
                    validFlag = false;
                    updateBreachData('city', {
                        ...breachData.city,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.plCarRegistration.value) {
                    validFlag = false;
                    updateBreachData('plCarRegistration', {
                        ...breachData.plCarRegistration,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.plkNumber.value) {
                    validFlag = false;
                    updateBreachData('plkNumber', {
                        ...breachData.plkNumber,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }

            if (breachData.safetyCategory.value === 'Muu') {
                if (!breachData.deviationType.value) {
                    validFlag = false;
                    updateBreachData('deviationType', {
                        ...breachData.deviationType,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (!breachData.eventLocation.value) {
                    validFlag = false;
                    updateBreachData('eventLocation', {
                        ...breachData.eventLocation,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
            }

            if (!validFlag) {
                return;
            }
        }
        if (activeStep < 3) {
            if (title && title.startsWith("PL") && activeStep === 0) {
                console.log("Title starts with PL");
                if (breachData.safetyCategory.value === 'PL Matkustajaturvallisuus') {
                    updateBreachData('incidentType', {
                        value: 'Väkivaltatilanne'
                    })
                }
                setActiveStep(2);
            }
            else {
                setActiveStep(activeStep + 1);
            }
        }
    }

    const handleSend = async () => {
        const breachDate = breachData.dateHappened.value;
        const breachTime = breachData.timeHappened.value;

        if (activeStep === 3) {
            if (breachData.personType.value !== 'vr') {
                let validFlag = true;
                if (breachData.personName.value === '') {
                    validFlag = false;
                    updateBreachData('personName', {
                        ...breachData.personName,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }
                if (breachData.companyName.value === '') {
                    validFlag = false;
                    updateBreachData('companyName', {
                        ...breachData.companyName,
                        error: 'Pakollinen tieto puuttuu...'
                    });
                }

                if (!validFlag) {
                    return;
                }
            }
        }

        // Extract date components using local time
        const year_s = breachDate.getFullYear();
        const month_s = (breachDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day_s = breachDate.getDate().toString().padStart(2, '0');

        // Construct date-time string in local time zone
        const localDateTimeString = `${year_s}-${month_s}-${day_s}T${breachTime}:00`;

        console.log("Fixed Date:", localDateTimeString);

        const now = new Date(localDateTimeString);
        console.log(now);
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Etc/GMT-2', // UTC+2
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // Ensure 12-hour format with AM/PM
        });
        const parts = formatter.formatToParts(now);

        // Extract parts
        const year = parts.find(p => p.type === 'year').value;
        const month = parts.find(p => p.type === 'month').value;
        const day = parts.find(p => p.type === 'day').value;
        let hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
        const minute = parts.find(p => p.type === 'minute').value;
        const second = parts.find(p => p.type === 'second').value;
        const ampm = parts.find(p => p.type === 'dayPeriod').value;

        // Convert hour to 24-hour format
        if (ampm === 'PM' && hour !== 12) {
            hour += 12;
        } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }

        // Build ISO strings
        const isoDate = `${year}-${month}-${day}`;
        const isoTime = `${hour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
        const isoDateTime = `${isoDate}T${isoTime}`;

        const selectIdMap = {
            'Matkustajaturvallisuus': 29,
            'Rautatieturvallisuus': 22,
            'Ratikkaturvallisuus': 23,
            'Tietoturvallisuus': 24,
            'Toimitilaturvallisuus': 26,
            'Ympäristöturvallisuus': 25,
            'Kalustoturvallisuus': 31,
            'PL Matkustajaturvallisuus': 32,
            'PL Tieliikenneturvallisuus': 33,
            'Muu': 28,
        }

        const Opt2Selected = breachData.safetyCategory.value === "Ratikkaturvallisuus" || breachData.safetyCategory.value === "Toimitilaturvallisuus" || breachData.safetyCategory.value === "Ympäristöturvallisuus" || breachData.safetyCategory.value === "Tietoturvallisuus" || breachData.safetyCategory.value === "Rautatieturvallisuus" ||
            (breachData.safetyCategory.value === "PL Tieliikenneturvallisuus" && breachData.eventNature.value === "Lievä liikennevahinko") ||
            (breachData.safetyCategory.value === "Muu" && breachData.deviationType.value === "Turvallisuuspoikkeama");
        const Opt3Selected = (breachData.safetyCategory.value !== "Ympäristöturvallisuus") && (breachData.incidentType.value === "Järjestyshäiriö" ||
            (breachData.safetyCategory.value === "PL Matkustajaturvallisuus" && breachData.incidentType.value === "Väkivaltatilanne") ||
            (breachData.eventNature.value === "Vakava liikennevahinko") ||
            (breachData.safetyCategory.value === "Muu" && breachData.deviationType.value === "Prosessipoikkeama") || 
            (breachData.safetyCategory.value === "Kalustoturvallisuus"));

        const Opt4Selected = breachData.incidentType.value === "Matkustajalle sattunut vahinko" || (breachData.eventNature.value === "Läheltä piti -tilanne" && breachData.safetyCategory.value === "PL Tieliikenneturvallisuus");
        const Opt5Selected = (breachData.safetyCategory.value !== "PL Matkustajaturvallisuus" && breachData.incidentType.value === "Väkivaltatilanne") ||
            (breachData.safetyCategory.value === "PL Matkustajaturvallisuus" && breachData.incidentType.value === "Omaisuusvahinko");
        const Opt6Selected = (breachData.safetyCategory.value === "Matkustajaturvallisuus" && breachData.incidentType.value === "Omaisuusvahinko");
        const Opt7Selected = (breachData.safetyCategory.value === "Matkustajaturvallisuus" && breachData.incidentType.value === "Ilkivalta");
        const Opt8Selected = (breachData.safetyCategory.value === "Matkustajaturvallisuus" && breachData.incidentType.value === "Liputtoman matkustajan häiriötön poisto");
        const custom106 = Object.entries(breachData.externalHelp.value)
            .filter(([key, value]) => value)
            .map(([key]) => {
                const translations = { guard: 'Vartija', police: 'Poliisi', firstAid: 'Ensihoito' };
                return translations[key];
            }).join(",");

        const substanceTarget = Object.entries(breachData.substanceTarget.value)
            .filter(([key, value]) => value)
            .map(([key]) => {
                const translations = { soilOrWater: 'Maaperä tai vesistö', air: 'Ilma', sewage: 'Viemäriverkko' };
                return translations[key];
            }).join(",");

        const custom5 = substanceTarget || breachData.unitIdentifier.value || breachData.routeId.value || breachData.influence.value || breachData.vehicleSeries.value;
        const custom6 = breachData.landOwner.value || breachData.hasToolsInPossession.value || breachData.hasToolsUsed.value;
        let custom4 = breachData.trafficSituation.value || breachData.violenceType.value || breachData.damageType.value || breachData.safetyDeviceElement.value ||
            breachData.identifier.value || breachData.substanceAmountEstimate.value || breachData.vehicleType.value ||
            breachData.opponentRegistration.value;
        const custom108 = breachData.propertyDamageLocation.value || breachData.trafficMode.value || breachData.trafficType.value || breachData.plCarRegistration.value;
        const custom3 = breachData.vehicleNumber.value || breachData.ykNumber.value || breachData.equipmentID.value || breachData.plkNumber.value;
        const custom0 = breachData.option2Value.value || breachData.stopId.value || breachData.city.value;
        const custom123 = breachData.owner.value;
        const custom2 = breachData.equipmentType.value || breachData.substanceName.value;
        const custom8 = breachData.firstAidGiven.value;
        const custom9 = breachData.emergencyServicesRequired.value;
        const custom105 = breachData.passengerTrainCode.value;

        if (breachData.safetyDeviceElement.value && breachData.identifier.value) {
            custom4 = `${custom4}, ${breachData.identifier.value}`;
        }

        setLoading(true);

        const data = {
            Name: userdata.username,
            Email: userdata.email,
            UserUnitCode: userdata.unitcode,
            ClientId: userdata.clientId,
            Files: breachData.files,
            EntityType: 3,
            PersonType: breachData.personType.value,
            Title: '',
            ReportTitle: 'Turvallisuuspoikkeama',
            Description: breachData.description.value,
            Reason: breachData.reason.value,
            Proposal: breachData.measure.value,
            Location: breachData.location.value || breachData.option3Value.value,
            LocationSpecifier: breachData.locationDetail.value || breachData.locationDetails.value,
            Place: {
                IsAdditional: breachData.locationDetail.value || breachData.locationDetails.value || breachData.option3Value.value ? false : true,
            },
            SelectedUnit: userdata.unitcode,
            SelectedTargets: [(selectIdMap[breachData.safetyCategory.value] ?? 0).toString()],
            SelectedTargetCollection: [
                {
                    Id: selectIdMap[breachData.safetyCategory.value] ?? 0,
                    Opt2Selected,
                    Opt3Selected,
                    Opt4Selected,
                    Opt5Selected,
                    Opt6Selected,
                    Opt7Selected,
                    Opt8Selected,
                    custom0,
                    custom1: custom0,
                    custom2,
                    custom7: breachData.eventLocation.value,
                    custom3,
                    custom4,
                    custom5,
                    custom6,
                    custom8,
                    custom9,
                    custom105,
                    custom106,
                    custom103: breachData.injuryType.value,
                    custom100: breachData.passengerAction.value,
                    custom101: breachData.doorJam.value,
                    custom102: breachData.platformFall.value,
                    custom107: breachData.option21Value.value,
                    custom110: breachData.personName.value,
                    custom111: breachData.companyName.value,
                    custom108,
                    custom123,
                    customField27: breachData.disturbanceOccured.value,
                    isNearMiss: (breachData.securityNotification.value),
                    target: breachData.eventType.value,
                }
            ],
            DateHappened: isoDate,
            TimeHappened: isoDateTime,
        }
        console.log(data);
        try {
            const token = userdata.token_type + ' ' + userdata.access_token;

            const serverConnected = await checkServerConnectivity();

            if (!serverConnected) {
                throw new Error('Ei server connectivity');
            }

            console.log('Sending data to server:', data);

            const response = await sendDataToServer(data, token);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Server response:', responseData);
            if (breachData.files.length > 0) {
                console.log('Sending files...');
                const fileUploadStatus = await sendFilesToServer({
                    ...data,
                    Id: responseData.Id,
                    Files: breachData.files
                }, token);

                if (!fileUploadStatus) {
                    throw new Error('Failed to upload files');
                }
            }

            setLoading(false);

            showToast("", "Ilmoituksen lähetys onnistui");
            cleanBreachData();
            navigation.navigate('ReportScreen');

        } catch (error) {
            console.error('Error in handleSend:', error);
            showToast("Error", i18n.t('serverError'), "error");

            try {
                await addReport(data, 'pending');
                showToast("Info", "lmoitus tallennettu ja se lähetetään kun verkkoyhteys on hyvä", "info");
                cleanBreachData();
            } catch (saveError) {
                console.error('Error saving locally:', saveError);
                showToast("Error", "Paikallinen tallennus epäonnistui", "error");
            }

            navigation.navigate('ReportScreen');

            setLoading(false);
        }
    }

    return (
        <ParallaxScrollView>
            <ContentHeader title={title.startsWith("PL") ? title.substring(3) : 'Turvallisuuspoikkeama'} id="12345789" date={new Date()} />
            <Card style={styles.container}>
                <Card.Content>
                    <ProgressSteps activeStep={activeStep} {...progressStepsStyle}>
                        <ProgressStep
                            label={'Step1'}
                            removeBtnRow={true}
                        >
                            <InformationDetailCommon
                                path={path}
                                reasons={breachData.reason.value}
                                setReasons={(value) => { updateBreachData('reason', { value, error: '' }) }}
                                description={breachData.description.value}
                                descriptionError={breachData.description.error}
                                setDescription={(value) => { updateBreachData('description', { value, error: '' }) }}
                                measures={breachData.measure.value}
                                setMeasures={(value) => { updateBreachData('measure', { value, error: '' }) }}
                                takePhoto={takePhoto}
                                camFiles={breachData.files}
                                onDeleteFile={removeFile}
                                setDateHappened={(value) => { updateBreachData('dateHappened', { value, error: '' }) }}
                                setTimeHappened={(value) => { updateBreachData('timeHappened', { value, error: '' }) }}
                                dateHappened={breachData.dateHappened}
                                timeHappened={breachData.timeHappened}
                            />

                            <View style={styles.buttonContainer}>
                                <PrevButton onPress={handlePrevious} disabled={activeStep < 1} />
                                <ContinueButton onPress={handleNext} />
                            </View>
                        </ProgressStep>
                        <ProgressStep
                            label={'Step2'}
                            removeBtnRow={true}
                        >
                            <ThemedView>
                                <RadioButton.Group
                                    onValueChange={(value) => { updateBreachData('safetyCategory', { value, error: '' }) }}
                                    value={breachData.safetyCategory.value}
                                >
                                    <View style={styles.radioButtonsContainer}>
                                        {
                                            !(title && title.startsWith("PL")) && 
                                            <>
                                                <RadioButton.Item label={'Matkustajaturvallisuus'} value="Matkustajaturvallisuus" />
                                                <RadioButton.Item label={'Rautatieturvallisuus'} value="Rautatieturvallisuus" />
                                                <RadioButton.Item label={'Ratikkaturvallisuus'} value="Ratikkaturvallisuus" />
                                                <RadioButton.Item label={'Tietoturvallisuus'} value="Tietoturvallisuus" />
                                                <RadioButton.Item label={'Toimitilaturvallisuus'} value="Toimitilaturvallisuus" />
                                                <RadioButton.Item label={'Ympäristöturvallisuus'} value="Ympäristöturvallisuus" />
                                                <RadioButton.Item label={'Kalustoturvallisuus'} value="Kalustoturvallisuus" />
                                                <RadioButton.Item label={'Tieliikenneturvallisuus'} value="PL Tieliikenneturvallisuus" />
                                                <RadioButton.Item label={'Muu'} value="Muu" />
                                            </>
                                        }
                                        {/* <RadioButton.Item label={'PL Matkustajaturvallisuus'} value="PL Matkustajaturvallisuus" /> */}
                                        {/* <RadioButton.Item label={'PL Tieliikenneturvallisuus'} value="PL Tieliikenneturvallisuus" /> */}
                                    </View>
                                </RadioButton.Group>
                            </ThemedView>
                            <View style={styles.buttonContainer}>
                                <PrevButton onPress={handlePrevious} disabled={activeStep < 1} />
                                <ContinueButton onPress={handleNext} />
                            </View>
                        </ProgressStep>
                        <ProgressStep
                            label={'Step3'}
                            removeBtnRow={true}
                        >
                            <ThemedView>
                                {
                                    !title.startsWith("PL") && (
                                        <>
                                            <ThemedText style={styles.radioGroupLabel}> {breachData.safetyCategory.value} </ThemedText>
                                        </>
                                    )
                                }
                                {breachData.safetyCategory.value === 'Matkustajaturvallisuus' && (
                                    <>
                                        <RadioButton.Group
                                            onValueChange={(value) => { updateBreachData('incidentType', { value, error: '' }) }}
                                            value={breachData.incidentType.value}
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.incidentType.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <View style={styles.radioButtonsContainer}>
                                                <RadioButton.Item label={'Järjestyshäiriö'} value="Järjestyshäiriö" />
                                                <RadioButton.Item label={'Matkustajalle sattunut vahinko'} value="Matkustajalle sattunut vahinko" />
                                                <RadioButton.Item label={'Väkivaltatilanne'} value="Väkivaltatilanne" />
                                                <RadioButton.Item label={'Omaisuusvahinko'} value="Omaisuusvahinko" />
                                                <RadioButton.Item label={'Ilkivalta'} value="Ilkivalta" />
                                                <RadioButton.Item label={'Liputtoman matkustajan häiriötön poisto'} value="Liputtoman matkustajan häiriötön poisto" />
                                            </View>
                                        </RadioButton.Group>

                                        <Divider style={styles.divider} />

                                        {breachData.incidentType.value === 'Järjestyshäiriö' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    onChangeText={(value) => {
                                                        updateBreachData('eventLocation', { value, error: '' })
                                                    }}
                                                    value={breachData.eventLocation.value}
                                                    errorText={breachData.eventLocation.error}
                                                    error={!!breachData.eventLocation.error}
                                                />

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.disturbanceOccured.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}> Järjestyshäiriö tapahtui?*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => { updateBreachData('disturbanceOccured', { value, error: '' }) }}
                                                        value={breachData.disturbanceOccured.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kalustossa'} value="Kalustossa" />
                                                            <RadioButton.Item label={'Kaluston ulkopuolella'} value="Kaluston ulkopuolella" />
                                                            {
                                                                breachData.disturbanceOccured.value === 'Kaluston ulkopuolella' && (
                                                                    <TextInput
                                                                        label={'Tapahtumapaikan tarkenne*'}
                                                                        onChangeText={(value) => { updateBreachData('locationDetails', { value, error: '' }) }}
                                                                        value={breachData.locationDetails.value}
                                                                        error={!!breachData.locationDetails.error}
                                                                        errorText={breachData.locationDetails.error}
                                                                    />
                                                                )
                                                            }
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.hasToolsInPossession.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko väkivaltaisella henkilöllä apuvälineitä käytössä (veitset, pamput tm.)?*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => { updateBreachData('hasToolsInPossession', { value, error: '' }) }}
                                                        value={breachData.hasToolsInPossession.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Tarvittiinko ulkopuolista apua?</ThemedText>
                                                    <View style={styles.radioButtonsContainer}>
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Vartija"
                                                            status={breachData.externalHelp.value.guard ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('guard')}
                                                        />
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Poliisi"
                                                            status={breachData.externalHelp.value.police ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('police')}
                                                        />
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Ensihoito"
                                                            status={breachData.externalHelp.value.firstAid ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('firstAid')}
                                                        />
                                                    </View>
                                                </View>


                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                                    <TextInput
                                                        label={'Matkustajaliikennejunan tunnus'}
                                                        onChangeText={(value) => { updateBreachData('passengerTrainCode', { value, error: '' }) }}
                                                        value={breachData.passengerTrainCode.value}
                                                        keyboardType="numeric"
                                                    />
                                                    <DropDownPicker
                                                        open={option21Open}
                                                        items={option21Items}
                                                        setOpen={setOption21Open}
                                                        setItems={setOption21Items}
                                                        searchable={true}
                                                        placeholder="Lähiliikennejunan kirjaintunnus"
                                                        listMode="MODAL"

                                                        value={breachData.option21Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option21Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Matkustajalle sattunut vahinko' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    onChangeText={(value) => {
                                                        updateBreachData('eventLocation', { value, error: '' })
                                                    }}
                                                    value={breachData.eventLocation.value}
                                                    errorText={breachData.eventLocation.error}
                                                    error={!!breachData.eventLocation.error}
                                                />

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.injuryType.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Vahingon tyyppi*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => {
                                                            updateBreachData('injuryType', { value, error: '' })
                                                        }}
                                                        value={breachData.injuryType.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Läheltä piti" value="Läheltä piti" />
                                                            <RadioButton.Item label="Sairaskohtaus" value="Sairaskohtaus" />
                                                            <RadioButton.Item label="Lievä loukkaantuminen" value="Lievä loukkaantuminen" />
                                                            <RadioButton.Item label="Vakava loukkaantuminen tai kuolema" value="Vakava loukkaantuminen tai kuolema" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>


                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.trafficSituation.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Liikennetilanne*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => {
                                                            updateBreachData('trafficSituation', { value, error: '' })
                                                        }}
                                                        value={breachData.trafficSituation.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Paikallaan" value="Paikallaan" />
                                                            <RadioButton.Item label="Lähtemässä liikkeelle" value="Lähtemässä liikkeelle" />
                                                            <RadioButton.Item label="Liikkeessä" value="Liikkeessä" />
                                                            <RadioButton.Item label="Pysähtymässä" value="Pysähtymässä" />
                                                            <RadioButton.Item label="Muu" value="Muu" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.passengerAction.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Matkustajan toiminta*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => {
                                                            updateBreachData('passengerAction', { value, error: '' })
                                                        }}
                                                        value={breachData.passengerAction.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Kaluston ulkopuolella" value="Kaluston ulkopuolella" />
                                                            <RadioButton.Item label="Nousemassa kalustoon" value="Nousemassa kalustoon" />
                                                            <RadioButton.Item label="Kalustossa" value="Kalustossa" />
                                                            <RadioButton.Item label="Poistumassa kalustosta" value="Poistumassa kalustosta" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.doorJam.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko kyseessä oven välin jäänti?*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => {
                                                            updateBreachData('doorJam', { value, error: '' })
                                                        }}
                                                        value={breachData.doorJam.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Kyllä" value="Kyllä" />
                                                            <RadioButton.Item label="Ei" value="Ei" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.platformFall.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko kyseessä laiturin ja kaluston väliin putoaminen?*</ThemedText>
                                                    <RadioButton.Group
                                                        onValueChange={(value) => {
                                                            updateBreachData('platformFall', { value, error: '' })
                                                        }}
                                                        value={breachData.platformFall.value}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Kyllä" value="Kyllä" />
                                                            <RadioButton.Item label="Ei" value="Ei" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Tarvittiinko ulkopuolista apua?</ThemedText>

                                                    <View style={styles.radioButtonsContainer}>
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Vartija"
                                                            status={breachData.externalHelp.value.guard ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('guard')}
                                                        />
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Poliisi"
                                                            status={breachData.externalHelp.value.police ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('police')}
                                                        />
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Ensihoito"
                                                            status={breachData.externalHelp.value.firstAid ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('firstAid')}
                                                        />
                                                    </View>
                                                </View>

                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                                    <TextInput
                                                        label={'Matkustajaliikennejunan tunnus'}
                                                        keyboardType="numeric"
                                                        onChangeText={(value) => {
                                                            updateBreachData('passengerTrainCode', { value, error: '' })
                                                        }}
                                                        value={breachData.passengerTrainCode.value}
                                                    />
                                                    <DropDownPicker
                                                        open={option21Open}
                                                        items={option21Items}
                                                        setOpen={setOption21Open}
                                                        setItems={setOption21Items}
                                                        searchable={true}
                                                        placeholder="Lähiliikennejunan kirjaintunnus"
                                                        listMode="MODAL"

                                                        value={breachData.option21Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option21Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Väkivaltatilanne' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    value={breachData.eventLocation.value}
                                                    onChangeText={(value) => updateBreachData('eventLocation', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    error={!!breachData.eventLocation.error}
                                                    errorText={breachData.eventLocation.error}
                                                />

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.violenceType.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Väkivaltatilanteen tyyppi*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.violenceType.value}
                                                        onValueChange={(value) => updateBreachData('violenceType', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Toteutunut väkivaltatilanne'} value={'Toteutunut väkivaltatilanne'} />
                                                            <RadioButton.Item label={'Vakava väkivallalla uhkaaminen'} value={'Vakava väkivallalla uhkaaminen'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.propertyDamageLocation.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.label}>Väkivaltatilanne tapahtui?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.propertyDamageLocation.value}
                                                        onValueChange={(value) => updateBreachData('propertyDamageLocation', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kalustossa'} value={'Kalustossa'} />
                                                            <RadioButton.Item label={'Kaluston ulkopuolella'} value={'Kaluston ulkopuolella'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                    {
                                                        breachData.propertyDamageLocation.value === 'Kaluston ulkopuolella' && (
                                                            <TextInput
                                                                label={'Tapahtumapaikan tarkenne*'}
                                                                onChangeText={(value) => { updateBreachData('locationDetails', { value, error: '' }) }}
                                                                value={breachData.locationDetails.value}
                                                                error={!!breachData.locationDetails.error}
                                                                errorText={breachData.locationDetails.error}
                                                            />
                                                        )
                                                    }
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.hasToolsUsed.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.label}>Oliko väkivaltaisella henkilöllä apuvälineitä käytössä (veitset, pamput tm.)?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.hasToolsUsed.value}
                                                        onValueChange={(value) => updateBreachData('hasToolsUsed', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Tarvittiinko ulkopuolista apua?</ThemedText>
                                                    <View style={styles.radioButtonsContainer}>
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Vartija"
                                                            status={breachData.externalHelp.value.guard ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('guard')}
                                                        />
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Poliisi"
                                                            status={breachData.externalHelp.value.police ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('police')}
                                                        />
                                                        <Checkbox.Item
                                                            style={styles.checkboxItem}
                                                            label="Ensihoito"
                                                            status={breachData.externalHelp.value.firstAid ? 'checked' : 'unchecked'}
                                                            onPress={() => handleExternalHelpChange('firstAid')}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.radioGroupContainer}>
                                                    <TextInput
                                                        label={'Kaluston tyyppi'}
                                                        value={breachData.equipmentType.value}
                                                        onChangeText={(value) => updateBreachData('equipmentType', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    />
                                                    <TextInput
                                                        label={'Kaluston tunnusnumero'}
                                                        value={breachData.equipmentID.value}
                                                        onChangeText={(value) => updateBreachData('equipmentID', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    />
                                                </View>

                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                                    <TextInput
                                                        label={'Matkustajaliikennejunan tunnus'}
                                                        value={breachData.passengerTrainCode.value}
                                                        onChangeText={(value) => updateBreachData('passengerTrainCode', {
                                                            value,
                                                            error: '',
                                                        })}
                                                        keyboardType="numeric"
                                                    />
                                                    <DropDownPicker
                                                        open={option21Open}
                                                        items={option21Items}
                                                        setOpen={setOption21Open}
                                                        setItems={setOption21Items}
                                                        searchable={true}
                                                        placeholder="Lähiliikennejunan kirjaintunnus"
                                                        listMode="MODAL"

                                                        value={breachData.option21Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option21Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Omaisuusvahinko' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    value={breachData.eventLocation.value}
                                                    onChangeText={(value) => updateBreachData('eventLocation', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    error={!!breachData.eventLocation.error}
                                                    errorText={breachData.eventLocation.error}
                                                />
                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.damageType.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Vahingon tyyppi*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.damageType.value}
                                                        onValueChange={(value) => updateBreachData('damageType', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Rikkoutuminen'} value={'Rikkoutuminen'} />
                                                            <RadioButton.Item label={'Varkaus'} value={'Varkaus'} />
                                                            <RadioButton.Item label={'Ajoneuvovahinko'} value={'Ajoneuvovahinko'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>
                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.propertyDamageLocation.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Omaisuusvahinko tapahtui*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.propertyDamageLocation.value}
                                                        onValueChange={(value) => updateBreachData('propertyDamageLocation', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kalustossa'} value={'Kalustossa'} />
                                                            <RadioButton.Item label={'Kaluston ulkopuolella'} value={'Kaluston ulkopuolella'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                    {
                                                        breachData.propertyDamageLocation.value === 'Kaluston ulkopuolella' && (
                                                            <TextInput
                                                                label={'Tapahtumapaikan tarkenne*'}
                                                                onChangeText={(value) => { updateBreachData('locationDetails', { value, error: '' }) }}
                                                                value={breachData.locationDetails.value}
                                                                error={!!breachData.locationDetails.error}
                                                                errorText={breachData.locationDetails.error}
                                                            />
                                                        )
                                                    }
                                                </View>

                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                                    <TextInput
                                                        label={'Matkustajaliikennejunan tunnus'}
                                                        value={breachData.passengerTrainCode.value}
                                                        onChangeText={(value) => updateBreachData('passengerTrainCode', {
                                                            value,
                                                            error: '',
                                                        })}
                                                        keyboardType="numeric"
                                                    />

                                                    <DropDownPicker
                                                        open={option21Open}
                                                        items={option21Items}
                                                        setOpen={setOption21Open}
                                                        setItems={setOption21Items}
                                                        searchable={true}
                                                        placeholder="Lähiliikennejunan kirjaintunnus"
                                                        listMode="MODAL"

                                                        value={breachData.option21Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option21Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Ilkivalta' && (
                                            <>
                                                <View style={styles.radioGroupContainer}>

                                                    <ThemedText style={styles.radioGroupLabel}>Ilkivalta</ThemedText>
                                                    <TextInput
                                                        style={styles.textInput}
                                                        label="Tapahtumapaikka*"
                                                        value={breachData.eventLocation.value}
                                                        onChangeText={(value) => updateBreachData('eventLocation', {
                                                            value,
                                                            error: '',
                                                        })}
                                                        error={!!breachData.eventLocation.error}
                                                        errorText={breachData.eventLocation.error}
                                                    />

                                                    <TextInput
                                                        style={styles.textInput}
                                                        label="Kaluston tunnusnumero"
                                                        value={breachData.equipmentID.value}
                                                        onChangeText={(value) => updateBreachData('equipmentID', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    />
                                                    <View style={styles.radioGroupContainer}>
                                                        <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                                        <TextInput
                                                            label={'Matkustajaliikennejunan tunnus'}
                                                            onChangeText={(value) => { updateBreachData('passengerTrainCode', { value, error: '' }) }}
                                                            value={breachData.passengerTrainCode.value}
                                                            keyboardType="numeric"
                                                        />
                                                        <DropDownPicker
                                                            open={option21Open}
                                                            items={option21Items}
                                                            setOpen={setOption21Open}
                                                            setItems={setOption21Items}
                                                            searchable={true}
                                                            placeholder="Lähiliikennejunan kirjaintunnus"
                                                            listMode="MODAL"

                                                            value={breachData.option21Value.value}
                                                            setValue={(getValue) => {
                                                                updateBreachData('option21Value', {
                                                                    value: getValue(),
                                                                    error: ''
                                                                })
                                                            }}
                                                            {...dropDownTheme}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Liputtoman matkustajan häiriötön poisto' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    value={breachData.eventLocation.value}
                                                    onChangeText={(value) => updateBreachData('eventLocation', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    error={!!breachData.eventLocation.error}
                                                    errorText={breachData.eventLocation.error}
                                                />
                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                                    <TextInput
                                                        label={'Matkustajaliikennejunan tunnus'}
                                                        value={breachData.passengerTrainCode.value}
                                                        onChangeText={(value) => updateBreachData('passengerTrainCode', {
                                                            value,
                                                            error: '',
                                                        })}
                                                        keyboardType="numeric"
                                                    />
                                                    <DropDownPicker
                                                        open={option21Open}
                                                        items={option21Items}
                                                        setOpen={setOption21Open}
                                                        setItems={setOption21Items}
                                                        searchable={true}
                                                        placeholder="Lähiliikennejunan kirjaintunnus"
                                                        listMode="MODAL"
                                                        value={breachData.option21Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option21Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Rautatieturvallisuus' && (
                                    <>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.option2Value.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Rautatieliikennepaikka*</ThemedText>
                                            <DropDownPicker
                                                open={option2Open}
                                                items={option2Items}
                                                setOpen={setOption2Open}
                                                value={breachData.option2Value.value}
                                                setValue={(getValue) => {
                                                    updateBreachData('option2Value', {
                                                        value: getValue(),
                                                        error: ''
                                                    })
                                                }}
                                                setItems={setOption2Items}
                                                searchable={true}
                                                placeholder="Tee valinta"
                                                listMode="MODAL"
                                                {...dropDownTheme}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.owner.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Rataverkon omistaja*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.owner.value}
                                                onValueChange={(value) => updateBreachData('owner', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label="Valtio" value="Valtio" />
                                                    <RadioButton.Item label="VR" value="VR" />
                                                    <RadioButton.Item label="Yksityinen" value="Yksityinen" />
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.eventType.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Tapahtumatyyppi*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.eventType.value}
                                                onValueChange={(value) => updateBreachData('eventType', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label="Junaliikenne" value={10100} />
                                                    <RadioButton.Item label="Vaihtotyö" value={10350} />
                                                    <RadioButton.Item label="Muu" value={12600} />
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.safetyDeviceElement.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Tapahtumaan liittyvä turvalaite-elementti*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.safetyDeviceElement.value}
                                                onValueChange={(value) => updateBreachData('safetyDeviceElement', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label="Ei valintaa" value="Ei valintaa" />
                                                    <RadioButton.Item label="Raide" value="Raide" />
                                                    <RadioButton.Item label="Vaihde" value="Vaihde" />
                                                    <RadioButton.Item label="Opastin" value="Opastin" />
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        <View style={styles.radioGroupContainer}>
                                            {breachData.safetyDeviceElement.value !== "Ei valintaa" && breachData.safetyDeviceElement.value !== "" && (
                                                <TextInput
                                                    label={'Elementin tunnus*'}
                                                    value={breachData.identifier.value}
                                                    onChangeText={(value) => updateBreachData('identifier', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    error={!!breachData.identifier.error}
                                                    errorText={breachData.identifier.error}
                                                />
                                            )}
                                            <TextInput
                                                label={'Yksikön tunnus*'}
                                                value={breachData.unitIdentifier.value}
                                                onChangeText={(value) => updateBreachData('unitIdentifier', {
                                                    value,
                                                    error: '',
                                                })}
                                                error={!!breachData.unitIdentifier.error}
                                                errorText={breachData.unitIdentifier.error}
                                                keyboardType="numeric"
                                            />
                                            <TextInput
                                                label={'Kaluston tyyppi'}
                                                value={breachData.equipmentType.value}
                                                onChangeText={(value) => updateBreachData('equipmentType', {
                                                    value,
                                                    error: '',
                                                })}
                                            />
                                            <TextInput
                                                label={'Kaluston tunnusnumero'}
                                                value={breachData.equipmentID.value}
                                                onChangeText={(value) => updateBreachData('equipmentID', {
                                                    value,
                                                    error: '',
                                                })}
                                            />
                                        </View>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.trafficMode.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Liikennemuoto*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.trafficMode.value}
                                                onValueChange={(value) => updateBreachData('trafficMode', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label={'Tavaraliikenne'} value={'Tavaraliikenne'} />
                                                    <RadioButton.Item label={'Kaukoliikenne'} value={'Kaukoliikenne'} />
                                                    <RadioButton.Item label={'Lähiliikenne'} value={'Lähiliikenne'} />
                                                    <RadioButton.Item label={'Muu'} value={'other'} />
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        {
                                            breachData.trafficMode.value === 'Lähiliikenne' && (
                                                <View style={styles.radioGroupContainer}>
                                                    <ThemedText style={styles.radioGroupLabel}>Lähiliikennejunan kirjaintunnus</ThemedText>
                                                    <DropDownPicker
                                                        open={option21Open}
                                                        items={option21Items}
                                                        setOpen={setOption21Open}
                                                        setItems={setOption21Items}
                                                        searchable={true}
                                                        placeholder="Tee valinta"
                                                        listMode="MODAL"

                                                        value={breachData.option21Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option21Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            )
                                        }
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Ratikkaturvallisuus' && (
                                    <>
                                        <TextInput
                                            label={'Tapahtumapaikka'}  // Location of the Event
                                            value={breachData.eventLocation.value}
                                            onChangeText={(value) => updateBreachData('eventLocation', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.eventLocation.error}
                                            errorText={breachData.eventLocation.error}
                                        />

                                        <View style={styles.radioGroupContainer}>
                                            <ThemedText style={styles.radioGroupLabel}>
                                                Ratikkapysäkki
                                            </ThemedText>
                                            <DropDownPicker
                                                open={optionStopIdOpen}
                                                items={optionStopIdItems}
                                                setOpen={setOptionStopIdOpen}
                                                setItems={setOptionStopIdItems}
                                                searchable={true}
                                                placeholder="Pysäkin tunnus listasta"
                                                listMode="MODAL"
                                                value={breachData.stopId.value}
                                                setValue={(getValue) => {
                                                    updateBreachData('stopId', {
                                                        value: getValue(),
                                                        error: ''
                                                    })
                                                }}
                                                {...dropDownTheme}
                                            />

                                            <TextInput
                                                label={"Ajetun linjan tunnus*"}
                                                value={breachData.routeId.value}
                                                onChangeText={(value) => updateBreachData('routeId', {
                                                    value,
                                                    error: '',
                                                })}
                                                error={!!breachData.routeId.error}
                                                errorText={breachData.routeId.error}
                                            />
                                            <TextInput
                                                label={"Kaluston tunnusnumero*"}
                                                value={breachData.equipmentID.value}
                                                onChangeText={(value) => updateBreachData('equipmentID', {
                                                    value,
                                                    error: '',
                                                })}
                                                error={!!breachData.equipmentID.error}
                                                errorText={breachData.equipmentID.error}
                                            />
                                        </View>

                                        <View style={styles.radioGroupContainer}>
                                            <ThemedText style={styles.radioGroupLabel}>
                                                Tarkempi tapahtumapaikka
                                            </ThemedText>
                                            <DropDownPicker
                                                open={option3Open}
                                                items={option3VRItems}
                                                setOpen={setOption3Open}
                                                setItems={setOption3VRItems}
                                                searchable={true}
                                                placeholder="Valinta listasta"
                                                listMode="MODAL"
                                                value={breachData.option3Value.value}
                                                setValue={(getValue) => {
                                                    updateBreachData('option3Value', {
                                                        value: getValue(),
                                                        error: ''
                                                    })
                                                }}
                                                {...dropDownTheme}
                                            />
                                            <TextInput
                                                label={'Tapahtumapaikan tarkenne'}
                                                value={breachData.locationDetails.value}
                                                onChangeText={(value) => updateBreachData('locationDetails', {
                                                    value,
                                                    error: '',
                                                })}
                                            />
                                        </View>

                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Tietoturvallisuus' && (
                                    <>
                                        <TextInput
                                            label={'Paikka*'}
                                            value={breachData.eventLocation.value}
                                            onChangeText={(value) => updateBreachData('eventLocation', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.eventLocation.error}
                                            errorText={breachData.eventLocation.error}
                                        />
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Toimitilaturvallisuus' && (
                                    <>
                                        <TextInput
                                            label={'Paikka/Osoite*'}
                                            value={breachData.eventLocation.value}
                                            onChangeText={(value) => updateBreachData('eventLocation', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.eventLocation.error}
                                            errorText={breachData.eventLocation.error}
                                        />
                                        <TextInput
                                            label={'Tapahtumapaikan tarkenne'}
                                            value={breachData.locationDetails.value}
                                            onChangeText={(value) => updateBreachData('locationDetails', {
                                                value,
                                                error: '',
                                            })}
                                        />
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Ympäristöturvallisuus' && (
                                    <>
                                        <TextInput
                                            label={'Paikka*'}
                                            value={breachData.eventLocation.value}
                                            onChangeText={(value) => updateBreachData('eventLocation', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.eventLocation.error}
                                            errorText={breachData.eventLocation.error}
                                        />
                                        <TextInput
                                            label={"Vuotaneen aineen nimi*"}
                                            value={breachData.substanceName.value}
                                            onChangeText={(value) => updateBreachData('substanceName', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.substanceName.error}
                                            errorText={breachData.substanceName.error}
                                        />
                                        <TextInput
                                            label={"Aineen YK-numero*"}
                                            value={breachData.ykNumber.value}
                                            onChangeText={(value) => updateBreachData('ykNumber', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.ykNumber.error}
                                            errorText={breachData.ykNumber.error}
                                        />
                                        <TextInput
                                            label={"Arvio vuotaneen aineen määrästä*"}
                                            value={breachData.substanceAmountEstimate.value}
                                            onChangeText={(value) => updateBreachData('substanceAmountEstimate', {
                                                value,
                                                error: '',
                                            })}
                                            error={!!breachData.substanceAmountEstimate.error}
                                            errorText={breachData.substanceAmountEstimate.error}
                                        />

                                        <View 
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.substanceTarget.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Mihin ainetta on joutunut</ThemedText>
                                            <View style={styles.radioButtonsContainer}>
                                                <Checkbox.Item
                                                    style={styles.checkboxItem}
                                                    label="Maaperä tai vesistö"
                                                    status={breachData.substanceTarget.value.soilOrWater ? 'checked' : 'unchecked'}
                                                    onPress={() => handleSubstanceTargetChange('soilOrWater')}
                                                />
                                                <Checkbox.Item
                                                    style={styles.checkboxItem}
                                                    label="Ilma"
                                                    status={breachData.substanceTarget.value.air ? 'checked' : 'unchecked'}
                                                    onPress={() => handleSubstanceTargetChange('air')}
                                                />
                                                <Checkbox.Item
                                                    style={styles.checkboxItem}
                                                    label="Viemäriverkko"
                                                    status={breachData.substanceTarget.value.sewage ? 'checked' : 'unchecked'}
                                                    onPress={() => handleSubstanceTargetChange('sewage')}
                                                />
                                            </View>
                                        </View>
                                        <TextInput
                                            label={"Maanomistaja jos on tiedossa"}
                                            value={breachData.landOwner.value}
                                            onChangeText={(value) => updateBreachData('landOwner', {
                                                value,
                                                error: '',
                                            })}
                                            placeholder="Kirjoita maanomistajan nimi"
                                        />

                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Kalustoturvallisuus' && (
                                    <>
                                        <Checkbox.Item
                                            style={styles.checkboxItem}
                                            label="Ilmoitus koskee läheltä-piti tilannetta"
                                            status={breachData.isNearMissSituation.value ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                updateBreachData('isNearMissSituation', {
                                                    value: !breachData.isNearMissSituation.value,
                                                    error: '',
                                                })
                                            }}
                                        />
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.option2Value.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            <ThemedText style={styles.radioGroupLabel}>Rautatieliikennepaikka*</ThemedText>
                                            <DropDownPicker
                                                open={option2Open}
                                                items={option2Items}
                                                setOpen={setOption2Open}
                                                value={breachData.option2Value.value}
                                                setValue={(getValue) => {
                                                    updateBreachData('option2Value', {
                                                        value: getValue(),
                                                        error: ''
                                                    })
                                                }}
                                                setItems={setOption2Items}
                                                searchable={true}
                                                placeholder="Liikennepaikka listasta"
                                                listMode="MODAL"
                                                {...dropDownTheme}
                                            />
                                        </View>
                                        <View style={styles.radioGroupContainer}>
                                            <ThemedText style={styles.radioGroupLabel}>Junan tunnus</ThemedText>
                                            <TextInput
                                                label={'Matkustajaliikennejunan tunnus'}
                                                value={breachData.passengerTrainCode.value}
                                                onChangeText={(value) => updateBreachData('passengerTrainCode', {
                                                    value,
                                                    error: '',
                                                })}
                                                keyboardType="numeric"
                                            />
                                            </View>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.eventType.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            {/* Event Type */}
                                            <ThemedText style={styles.radioGroupLabel}>Tapahtumatyyppi*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.eventType.value}
                                                onValueChange={(value) => updateBreachData('eventType', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label="Junaliikenne" value={31100} />
                                                    <RadioButton.Item label="Radanpito" value={30900} />
                                                    <RadioButton.Item label="Vaihtotyö" value={30350} />
                                                    <RadioButton.Item label="Huoltoylitys" value={108500} />
                                                    <RadioButton.Item label="Muu" value={32600} />
                                                </View>
                                            </RadioButton.Group>
                                        </View>

                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.trafficType.error ? styles.errorBorder : null
                                            ]}
                                        >

                                            {/* Traffic Type */}
                                            <ThemedText style={styles.radioGroupLabel}>Liikennelaji*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.trafficType.value}
                                                onValueChange={(value) => updateBreachData('trafficType', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label="Kaukoliikenne" value="Kaukoliikenne" />
                                                    <RadioButton.Item label="Kaupunkiliikenne" value="Kaupunkiliikenne" />
                                                    <RadioButton.Item label="Tavaraliikenne" value="Tavaraliikenne" />
                                                    <RadioButton.Item label="Muu" value="Muu" />
                                                </View>
                                            </RadioButton.Group>
                                        </View>

                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.vehicleType.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            {/* Vehicle Type */}
                                            <ThemedText style={styles.radioGroupLabel}>Kalustolaji*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.vehicleType.value}
                                                onValueChange={(value) => updateBreachData('vehicleType', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label="Veturivetoinen matkustajavaunu" value="Veturivetoinen matkustajavaunu" />
                                                    <RadioButton.Item label="Sähkömoottorijuna" value="Sähkömoottorijuna" />
                                                    <RadioButton.Item label="Dieselmoottorijuna" value="Dieselmoottorijuna" />
                                                    <RadioButton.Item label="Sähköveturi" value="Sähköveturi" />
                                                    <RadioButton.Item label="Dieselveturi" value="Dieselveturi" />
                                                    <RadioButton.Item label="Tavaravaunu" value="Tavaravaunu" />
                                                    <RadioButton.Item label="Ratatyökone" value="Ratatyökone" />
                                                    <RadioButton.Item label="Muu" value="Muu" />
                                                </View>
                                            </RadioButton.Group>
                                        </View>

                                        {/* Vehicle Series */}
                                        <TextInput
                                            label={"Kaluston littera*"}
                                            value={breachData.vehicleSeries.value}
                                            onChangeText={(value) => updateBreachData('vehicleSeries', {
                                                value,
                                                error: '',
                                            })}
                                            placeholder="Syötä kaluston littera"
                                            style={styles.input}
                                            errorText={breachData.vehicleSeries.error}
                                            error={!!breachData.vehicleSeries.error}
                                        />

                                        {/* Vehicle Number */}
                                        <TextInput
                                            label={"Kaluston tunnusnumero*"}
                                            value={breachData.vehicleNumber.value}
                                            onChangeText={(value) => updateBreachData('vehicleNumber', {
                                                value,
                                                error: '',
                                            })}
                                            placeholder="Syötä kaluston tunnusnumero"
                                            style={styles.input}
                                            errorText={breachData.vehicleNumber.error}
                                            error={!!breachData.vehicleNumber.error}
                                        />
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'PL Matkustajaturvallisuus' && (
                                    <>
                                        <RadioButton.Group
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.incidentType.error ? styles.errorBorder : null
                                            ]}

                                            value={breachData.incidentType.value}
                                            onValueChange={(value) => updateBreachData('incidentType', {
                                                value,
                                                error: '',
                                            })}
                                        >
                                            <View style={styles.radioButtonsContainer}>
                                                <RadioButton.Item label={'Väkivaltatilanne'} value="Väkivaltatilanne" />
                                                <RadioButton.Item label={'Matkustajalle sattunut vahinko'} value="Matkustajalle sattunut vahinko" />
                                                <RadioButton.Item label={'Omaisuusvahinko'} value="Omaisuusvahinko" />
                                            </View>
                                        </RadioButton.Group>

                                        <Divider style={styles.divider} />

                                        {breachData.incidentType.value === 'Väkivaltatilanne' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    value={breachData.eventLocation.value}
                                                    onChangeText={(value) => updateBreachData('eventLocation', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    error={!!breachData.eventLocation.error}
                                                    errorText={breachData.eventLocation.error}
                                                />

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.violenceType.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Väkivaltatilanteen tyyppi*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.violenceType.value}
                                                        onValueChange={(value) => updateBreachData('violenceType', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Toteutunut väkivaltatilanne'} value={'Toteutunut väkivaltatilanne'} />
                                                            <RadioButton.Item label={'Vakava väkivallalla uhkaaminen'} value={'Vakava väkivallalla uhkaaminen'} />
                                                            <RadioButton.Item label={'Järjestyshäiriö'} value={"Järjestyshäiriö"} />
                                                            <RadioButton.Item label={'Ilkivalta'} value={"Ilkivalta"} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.influence.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko tekijä havaittavasti jonkin päihteen vaikutuksen alaisena?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.influence.value}
                                                        onValueChange={(value) => updateBreachData('influence', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                            <RadioButton.Item label={'En osaa sanoa'} value={'En osaa sanoa'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.hasToolsUsed.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko väkivaltaisella henkilöllä apuvälineitä käytössä (veitset, pamput tm.)?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.hasToolsUsed.value}
                                                        onValueChange={(value) => updateBreachData('hasToolsUsed', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>
                                                
                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.emergencyServicesRequired.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Tarvittiinko ambulanssia tai poliisia?</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.emergencyServicesRequired.value}
                                                        onValueChange={(value) => updateBreachData('emergencyServicesRequired', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.firstAidGiven.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Annettiinko ensiapua henkilökunnan toimesta?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.firstAidGiven.value}
                                                        onValueChange={(value) => updateBreachData('firstAidGiven', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Matkustajalle sattunut vahinko' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    value={breachData.eventLocation.value}
                                                    onChangeText={(value) => updateBreachData('eventLocation', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    errorText={breachData.eventLocation.error}
                                                    error={!!breachData.eventLocation.error}
                                                />

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.injuryType.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Vahingon tyyppi*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.injuryType.value}
                                                        onValueChange={(value) => updateBreachData('injuryType', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Läheltä piti" value="Läheltä piti" />
                                                            <RadioButton.Item label="Sairaskohtaus" value="Sairaskohtaus" />
                                                            <RadioButton.Item label="Lievä loukkaantuminen" value="Lievä loukkaantuminen" />
                                                            <RadioButton.Item label="Vakava loukkaantuminen tai kuolema" value="Vakava loukkaantuminen tai kuolema" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.influence.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko tekijä havaittavasti jonkin päihteen vaikutuksen alaisena?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.influence.value}
                                                        onValueChange={(value) => updateBreachData('influence', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Kyllä'} value={'Kyllä'} />
                                                            <RadioButton.Item label={'Ei'} value={'Ei'} />
                                                            <RadioButton.Item label={'En osaa sanoa'} value={'En osaa sanoa'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.trafficSituation.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Liikennetilanne*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.trafficSituation.value}
                                                        onValueChange={(value) => updateBreachData('trafficSituation', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Paikallaan" value="Paikallaan" />
                                                            <RadioButton.Item label="Lähtemässä liikkeelle" value="Lähtemässä liikkeelle" />
                                                            <RadioButton.Item label="Liikkeessä" value="Liikkeessä" />
                                                            <RadioButton.Item label="Pysähtymässä" value="Pysähtymässä" />
                                                            <RadioButton.Item label="Muu" value="Muu" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.passengerAction.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Matkustajan toiminta*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.passengerAction.value}
                                                        onValueChange={(value) => updateBreachData('passengerAction', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Kaluston ulkopuolella" value="Kaluston ulkopuolella" />
                                                            <RadioButton.Item label="Nousemassa kalustoon" value="Nousemassa kalustoon" />
                                                            <RadioButton.Item label="Kalustossa" value="Kalustossa" />
                                                            <RadioButton.Item label="Poistumassa kalustosta" value="Poistumassa kalustosta" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.doorJam.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko kyseessä oven välin jäänti?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.doorJam.value}
                                                        onValueChange={(value) => updateBreachData('doorJam', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Kyllä" value="Kyllä" />
                                                            <RadioButton.Item label="Ei" value="Ei" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>

                                                {/* <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.platformFall.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Oliko kyseessä laiturin ja kaluston väliin putoaminen?*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.platformFall.value}
                                                        onValueChange={(value) => updateBreachData('platformFall', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label="Kyllä" value="Kyllä" />
                                                            <RadioButton.Item label="Ei" value="Ei" />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View> */}

                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.option3Value.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>
                                                        Tarkempi tapahtumapaikka*
                                                    </ThemedText>
                                                    <DropDownPicker
                                                        open={option3Open}
                                                        items={option3Items}
                                                        setOpen={setOption3Open}
                                                        setItems={setOption3Items}
                                                        searchable={true}
                                                        placeholder="Valinta listasta"
                                                        listMode="MODAL"
                                                        value={breachData.option3Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option3Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                        {breachData.incidentType.value === 'Omaisuusvahinko' && (
                                            <>
                                                <TextInput
                                                    label={'Tapahtumapaikka*'}  // Location of the Event
                                                    value={breachData.eventLocation.value}
                                                    onChangeText={(value) => updateBreachData('eventLocation', {
                                                        value,
                                                        error: '',
                                                    })}
                                                    errorText={breachData.eventLocation.error}
                                                    error={!!breachData.eventLocation.error}
                                                />
                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.damageType.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>Vahingon tyyppi*</ThemedText>
                                                    <RadioButton.Group
                                                        value={breachData.damageType.value}
                                                        onValueChange={(value) => updateBreachData('damageType', {
                                                            value,
                                                            error: '',
                                                        })}
                                                    >
                                                        <View style={styles.radioButtonsContainer}>
                                                            <RadioButton.Item label={'Rikkoutuminen'} value={'Rikkoutuminen'} />
                                                            <RadioButton.Item label={'Varkaus'} value={'Varkaus'} />
                                                            <RadioButton.Item label={'Ajoneuvovahinko'} value={'Ajoneuvovahinko'} />
                                                        </View>
                                                    </RadioButton.Group>
                                                </View>
                                                <View
                                                    style={[
                                                        styles.radioGroupContainer,
                                                        breachData.option3Value.error ? styles.errorBorder : null
                                                    ]}
                                                >
                                                    <ThemedText style={styles.radioGroupLabel}>
                                                        Tarkempi tapahtumapaikka*
                                                    </ThemedText>
                                                    <DropDownPicker
                                                        open={option3Open}
                                                        items={option3Items}
                                                        setOpen={setOption3Open}
                                                        setItems={setOption3Items}
                                                        searchable={true}
                                                        placeholder="Valinta listasta"
                                                        listMode="MODAL"
                                                        value={breachData.option3Value.value}
                                                        setValue={(getValue) => {
                                                            updateBreachData('option3Value', {
                                                                value: getValue(),
                                                                error: ''
                                                            })
                                                        }}
                                                        {...dropDownTheme}
                                                    />
                                                </View>
                                            </>
                                        )}
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'PL Tieliikenneturvallisuus' && (
                                    <>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.eventNature.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            {/* Tapahtuman luonne */}
                                            <ThemedText style={styles.radioGroupLabel}>Tapahtuman luonne*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.eventNature.value}
                                                onValueChange={(value) => updateBreachData('eventNature', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label={'Läheltä piti -tilanne'} value={'Läheltä piti -tilanne'} />
                                                    <RadioButton.Item label={'Lievä liikennevahinko'} value={'Lievä liikennevahinko'} />
                                                    <RadioButton.Item label={'Vakava liikennevahinko'} value={'Vakava liikennevahinko'} />
                                                </View>
                                            </RadioButton.Group>
                                        </View>

                                        <View
                                            style={styles.radioGroupContainer}
                                        >
                                            {/* Tapahtumapaikka */}
                                            <ThemedText style={styles.radioGroupLabel}>Tapahtumapaikka (Osoite)*</ThemedText>
                                            <TextInput
                                                label={"Kaupunki*"}
                                                value={breachData.city.value}
                                                onChangeText={(value) => updateBreachData('city', {
                                                    value,
                                                    error: '',
                                                })}
                                                placeholder="Syötä kaupungin nimi"
                                                style={styles.input}
                                                error={!!breachData.city.error}
                                                errorText={breachData.city.error}
                                            />
                                            <TextInput
                                                label={"Katuosoite*"}
                                                value={breachData.eventLocation.value}
                                                onChangeText={(value) => updateBreachData('eventLocation', {
                                                    value,
                                                    error: '',
                                                })}
                                                placeholder="Syötä katuosoite"
                                                style={styles.input}
                                                error={!!breachData.eventLocation.error}
                                                errorText={breachData.eventLocation.error}
                                            />
                                        </View>
                                        <View
                                            style={styles.radioGroupContainer}
                                        >
                                            <TextInput
                                                label={"Auton rekisteritunnus*"}
                                                value={breachData.plCarRegistration.value}
                                                onChangeText={(value) => updateBreachData('plCarRegistration', {
                                                    value,
                                                    error: '',
                                                })}
                                                placeholder="Syötä PL:n auton rekisteritunnus"
                                                style={styles.input}
                                                error={!!breachData.plCarRegistration.error}
                                                errorText={breachData.plCarRegistration.error}
                                            />
                                            <TextInput
                                                label={"PL:n auton tunnus*"}
                                                value={breachData.plkNumber.value}
                                                onChangeText={(value) => updateBreachData('plkNumber', {
                                                    value,
                                                    error: '',
                                                })}
                                                placeholder="Syötä PLK-numero"
                                                style={styles.input}
                                                error={!!breachData.plkNumber.error}
                                                errorText={breachData.plkNumber.error}
                                            />
                                        </View>
                                        <View
                                            style={styles.radioGroupContainer}
                                        >
                                            <TextInput
                                                label={"Vastapuolen rekisterinumero mikäli tiedossa"}
                                                value={breachData.opponentRegistration.value}
                                                onChangeText={(value) => updateBreachData('opponentRegistration', {
                                                    value,
                                                    error: '',
                                                })}
                                                placeholder="Syötä vastapuolen rekisterinumero"
                                                style={styles.input}
                                            />
                                            <TextInput
                                                label={"Tarkempi tapahtumapaikka"}
                                                value={breachData.locationDetail.value}
                                                onChangeText={(value) => updateBreachData('locationDetail', {
                                                    value,
                                                    error: '',
                                                })}
                                                placeholder="Syötä tarkempi tapahtumapaikka"
                                                style={styles.input}
                                            />
                                        </View>
                                    </>
                                )}
                                {breachData.safetyCategory.value === 'Muu' && (
                                    <>
                                        <View
                                            style={[
                                                styles.radioGroupContainer,
                                                breachData.deviationType.error ? styles.errorBorder : null
                                            ]}
                                        >
                                            {/* Tapahtuman luonne */}
                                            <ThemedText style={styles.radioGroupLabel}>Tapahtuman luonne*</ThemedText>
                                            <RadioButton.Group
                                                value={breachData.deviationType.value}
                                                onValueChange={(value) => updateBreachData('deviationType', {
                                                    value,
                                                    error: '',
                                                })}
                                            >
                                                <View style={styles.radioButtonsContainer}>
                                                    <RadioButton.Item label={'Turvallisuuspoikkeama'} value={'Turvallisuuspoikkeama'} />
                                                    <RadioButton.Item label={'Prosessipoikkeama'} value={'Prosessipoikkeama'} />
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                        <View style={styles.container}>
                                            <TextInput
                                                label={'Tapahtumapaikka*'}  // Location of the Event
                                                value={breachData.eventLocation.value}
                                                onChangeText={(value) => updateBreachData('eventLocation', {
                                                    value,
                                                    error: '',
                                                })}
                                                error={!!breachData.eventLocation.error}
                                                errorText={breachData.eventLocation.error}
                                            />
                                        </View>
                                    </>
                                )}
                            </ThemedView>

                            <View style={styles.buttonContainer}>
                                <PrevButton onPress={handlePrevious} disabled={activeStep < 1} />
                                <ContinueButton onPress={handleNext} />
                            </View>
                        </ProgressStep>
                        <ProgressStep
                            label={'Step4'}
                            removeBtnRow={true}
                        >
                            <ReporterDataCommon
                                personType={breachData.personType}
                                setPersonType={(value) => updateBreachData('personType', {
                                    value,
                                    error: '',
                                })}
                                personName={breachData.personName}
                                setPersonName={(value) => updateBreachData('personName', {
                                    value,
                                    error: '',
                                })}
                                companyName={breachData.companyName}
                                setCompanyName={(value) => updateBreachData('companyName', {
                                    value,
                                    error: '',
                                })}
                            />

                            <View style={styles.buttonContainer}>
                                <PrevButton onPress={handlePrevious} disabled={activeStep < 1} />
                                <SubmitButton onPress={handleSend} />
                            </View>
                        </ProgressStep>
                    </ProgressSteps>
                </Card.Content>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                )}
            </Card>

        </ParallaxScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.default,
        marginBottom: 10,
    },
    divider: {
        marginVertical: 10,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1E20',
        marginBottom: 4,
    },
    button: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        borderRadius: 1,
        backgroundColor: '#F6F9FE',
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600'
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    radioLabel: {
        fontSize: 16,
        marginLeft: 5,
        color: '#1D1E20',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 10
    },
    stepLabel: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.primary,
    },
    activeStepLabel: {
        color: theme.colors.secondary,
    },
    stepIndicator: {
        backgroundColor: theme.colors.primary,
    },
    activeStepIndicator: {
        backgroundColor: theme.colors.secondary,
    },
    radioGroupContainer: {
        marginVertical: 5,
        borderWidth: 1,
        borderColor: theme.colors.lightPrimary,
        borderRadius: 8,
        padding: 10,
    },
    radioGroupLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    radioButtonsContainer: {
        backgroundColor: theme.colors.lightPrimary,
        borderRadius: 4,
    },
    checkboxItem: {
        marginVertical: 0,
    },
    radioButtonItem: {
        marginVertical: 2,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(128, 128, 128, 0.7)', // Optional: semi-transparent background
    },
    errorBorder: {
        borderColor: theme.colors.errorBoundaryColor,
        borderWidth: 2, // Highlight border when error exists
    }
});
