import { createStackNavigator } from "@react-navigation/stack";
import { useMyContextController } from "../store";
import { IconButton } from "react-native-paper";
import Customers from "../screens/Customers";
import CustomerDetail from "../screens/CustomerDetail";
import DeviceCustomer from "../screens/DeviceCustomer";
const Stack = createStackNavigator()
const Routercustomers = () =>{
    const [controller, dispatch] = useMyContextController()
    const {userLogin} = controller

    return(
        <Stack.Navigator
            initialRouteName="Services"
            screenOptions={{
                title: (userLogin!=null)&& (userLogin.name),
                headerTitleAlign: 'center',
                headerShown:false,
                headerStyle: {
                    backgroundColor: "tomato"
                },
                headerRight: (props) => <IconButton icon={"account"}/>
            }}
        >
            <Stack.Screen name="Customers" component={Customers}/>
            <Stack.Screen name="CustomerDetail" component={CustomerDetail}/>
            <Stack.Screen name="DeviceCustomer" component={DeviceCustomer}/>
        </Stack.Navigator>
    )
}
export default Routercustomers