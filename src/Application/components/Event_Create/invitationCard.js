import react from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { decryptData } from "../../../../utils/Hash";

const InviteCard = ({ DATA, EVENT, getPageStack, setPageStack }) => {
    return (<>
        {DATA.STATUS == "PENDING" &&
            <View style={[{ borderWidth: 2, borderColor: '#cfc8c84d', borderRadius: 10, padding: 10, marginVertical: 5, backgroundColor: "rgb(88, 131, 215)" }]}>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Email :</Text> {DATA.MEMBER_EMAIL}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Event :</Text> {decryptData(EVENT.EVENT_NAME)}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Date :</Text> {decryptData(EVENT.EVENT_DATE)}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Location :</Text> {decryptData(EVENT.EVENT_LOCATION)}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Status :</Text> {DATA.STATUS}</Text>
            </View>
        }
        {DATA.STATUS == "ACCEPTED" &&
            <View style={[{ borderWidth: 2, borderColor: '#cfc8c84d', borderRadius: 10, padding: 10, marginVertical: 5, backgroundColor: "rgb(215, 88, 118)" }]}>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Email :</Text> {DATA.MEMBER_EMAIL}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Event :</Text> {decryptData(EVENT.EVENT_NAME)}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Date :</Text> {decryptData(EVENT.EVENT_DATE)}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Location :</Text> {decryptData(EVENT.EVENT_LOCATION)}</Text>
                <Text style={[{ color: 'white' }]}><Text style={[{ fontWeight: 'bold' }]}>Status :</Text> {DATA.STATUS}</Text>
            </View>
        }
    </>)
}

export { InviteCard };