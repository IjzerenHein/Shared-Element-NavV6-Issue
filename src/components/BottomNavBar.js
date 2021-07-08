import React from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

//custom components
import ScaleButton from '../components/TouchableScale'

//colors
import colors from '../constants/colors'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

//ionicons
import { Ionicons } from '@expo/vector-icons'
import { Icon } from 'react-native-elements'

const { width } = Dimensions.get('screen')

const BottomNavBar = (props) => {
    const insets = useSafeAreaInsets()

    let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10
    return (
        <View>
            <View
                style={{
                    ...styles.tabBarShadow,
                    width: width,
                    bottom: 0,
                    height: 50 + insets.bottom,
                }}
            >
                <LinearGradient
                    colors={[colors.darkColorP1, colors.darkColorP1]}
                    style={styles.innerCont}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <TouchableWithoutFeedback onPress={props.onSearchPressed}>
                        <View style={styles.tabButton}></View>
                    </TouchableWithoutFeedback>

                    <View style={{ width: 50 }}></View>
                    <TouchableWithoutFeedback onPress={props.onRightPressed}>
                        <View style={styles.tabButton}></View>
                    </TouchableWithoutFeedback>

                    <Ionicons
                        name="camera-outline"
                        // color={colors.textColor}
                        color={'white'}
                        size={29}
                        style={{
                            position: 'absolute',
                            top: 10,
                            right: (width - 26) / 6,
                        }}
                        onPress={props.onRightPressed}
                    />

                    <Ionicons
                        name="search-outline"
                        size={28}
                        // color={colors.textColor}
                        color={'white'}
                        style={{
                            position: 'absolute',
                            top: 11,
                            left: (width - 26) / 6,
                        }}
                        onPress={props.onSearchPressed}
                    />
                </LinearGradient>
            </View>
            <View
                style={{
                    ...styles.floatingPlusCont,
                    left: width / 2 - 25,
                    bottom: tabBarBottomPosition + 12,
                }}
            >
                <ScaleButton
                    onPress={props.onPlusPressed}
                    activeScale={0.87}
                    // contentContainerStyle={styles.cellOuter}
                >
                    <View style={styles.bigPlusButton}>
                        <LinearGradient
                            colors={[colors.nPButton, colors.nPButton]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.bigPlusButton}
                        >
                            <Icon
                                name="plus"
                                type="material-community"
                                size={38}
                                // color={colors.textColor}
                                color={'white'}
                            />
                        </LinearGradient>
                    </View>
                </ScaleButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 50,
        // backgroundColor: 'rgba(255, 227, 255, 1)',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginHorizontal: 10,
        position: 'absolute',
        alignItems: 'center',
        overflow: 'hidden',
    },
    innerCont: {
        flex: 1,
        flexDirection: 'row',
    },
    tabBarImage: {
        height: 50,
        marginHorizontal: 10,
        position: 'absolute',
    },
    tabBarGradient: {
        flex: 1,
        // borderRadius: 15,
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        minHeight: '100%',
    },

    tabLabel: {
        color: 'white',
        fontSize: 10,
    },
    tabLabel2: {
        color: 'white',
        fontSize: 10,
    },
    tabBarShadow: {
        position: 'absolute',
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        // borderRadius: 15,
        shadowColor: 'black',
        shadowRadius: 3,
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 5,
    },
    bigPlusButton: {
        backgroundColor: colors.darkestColorP1,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    floatingPlusCont: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        // overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
        elevation: 10,
    },
    floatingTouchable: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'red',
    },
})

export default BottomNavBar
