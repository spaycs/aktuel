import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../res/colors";

const Button = ({onPress, title}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}
export default Button;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.red,
        height: 42,
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 5,
        width: "100%",
        borderRadius:10,
        
    },
    text: {
        color: colors.white,
        fontSize: 13,
        textAlign: 'center',
    }
})