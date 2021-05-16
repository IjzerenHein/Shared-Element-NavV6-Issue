import React, { useState } from 'react'
import { View, Text, StyleSheet, Keyboard, Platform } from 'react-native'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'

//safe area
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// to calculate safe area dimensions
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets'

//ionicons
import { Ionicons } from '@expo/vector-icons'

//Linear Gradient
import { LinearGradient } from 'expo-linear-gradient'

//colors
import colors from '../../constants/colors'

//custom button
import Button from '../../components/Button'

//picker
import DateTimePicker from '@react-native-community/datetimepicker'

//redux
import { addBirthday } from '../../store/signup/actions'
import { useDispatch, useSelector } from 'react-redux'

function hideKeyboard() {
    Keyboard.dismiss()
}

const DAddYourBirthday = (props) => {
    const insets = useSafeAreaInsets()

    const [topDimensions, setTopDimensions] = useState({ height: 0, width: 0 })
    const [useableScreenDimensions, setUseableScreenDimensions] = useState({
        height: 0,
        width: 0,
    })

    const dispatch = useDispatch()

    const [dateError, setDateError] = useState(' ')

    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date
        setShow(Platform.OS === 'ios')

        var todayDate = new Date()

        if (todayDate < selectedDate) {
            setDate(todayDate)
            setDateError('Please select a valid date.')
            return
        }
        setDate(currentDate)
        setDateError(' ')
    }

    const showMode = (currentMode) => {
        setShow(true)
        setMode(currentMode)
    }

    const showDatepicker = () => {
        showMode('date')
    }

    const showTimepicker = () => {
        showMode('time')
    }

    function nextPressedHandler() {
        // console.log(dateError)
        // if (dateError !== ' ') {
        //     return
        // }
        dispatch(addBirthday(date))
        props.navigation.navigate('FUserName')
    }

    return (
        <LinearGradient
            // colors={['rgba(255, 237, 187, 1)', 'rgba(255, 227, 255, 1)']}
            colors={['rgba(255, 237, 187, 1)', 'rgba(150, 227, 255, 1)']}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <View
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    flex: 1,
                }}
            >
                <View style={styles.xCont}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                    >
                        <Ionicons
                            name="chevron-back-outline"
                            size={40}
                            color={colors.mediumTint}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 20,
                    }}
                    onLayout={(event) => {
                        setUseableScreenDimensions({
                            width: event.nativeEvent.layout.width,
                            height: event.nativeEvent.layout.height,
                        })
                    }}
                >
                    <TouchableWithoutFeedback onPress={hideKeyboard}>
                        <View
                            onLayout={(event) => {
                                setTopDimensions({
                                    width: event.nativeEvent.layout.width,
                                    height: event.nativeEvent.layout.height,
                                })
                            }}
                        >
                            <View style={styles.titleCont}>
                                <Text
                                    style={styles.title}
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                >
                                    Add Your Birthday
                                </Text>
                                <Text
                                    style={styles.underTitle}
                                    maxFontSizeMultiplier={
                                        colors.maxFontSizeMultiplier
                                    }
                                >
                                    This won't be part of your public profile.
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.midCont,
                                {
                                    height:
                                        useableScreenDimensions.height -
                                        topDimensions.height,
                                },
                            ]}
                        >
                            <View>
                                <View style={styles.textInputCont}>
                                    <Text
                                        style={styles.input}
                                        selectionColor={colors.lightTint}
                                        underlineColorAndroid="rgba(255,255,255,0)"
                                        maxFontSizeMultiplier={
                                            colors.maxFontSizeMultiplier
                                        }
                                    >
                                        {`${date.toLocaleDateString('en-EN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}`}
                                    </Text>
                                </View>
                                <Text style={styles.errorText}>
                                    {dateError}
                                </Text>
                            </View>

                            <View>
                                <Button
                                    style={styles.button}
                                    onPress={nextPressedHandler}
                                    text="Next"
                                />
                                <View>
                                    <DateTimePicker
                                        style={{
                                            width: '100%',
                                            height: 200,
                                        }}
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={mode}
                                        // is24Hour={true}
                                        display="spinner"
                                        onChange={onDateChange}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    xCont: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleCont: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        color: colors.placeHolder,
    },

    underTitle: {
        color: colors.mediumTint,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 15,
    },
    underTitleBold: {
        color: colors.mediumTint,
        fontWeight: 'bold',
        fontSize: 15,
    },
    topBottomCont: {
        borderBottomColor: colors.mediumTint,
        borderBottomWidth: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonText: {
        color: colors.mediumTint,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        minWidth: '50%',
        textAlign: 'center',
        marginBottom: 10,
    },
    bottomLineCont: {
        flexDirection: 'row',
    },
    selectedLine: {
        borderBottomColor: colors.mediumTint,
        borderBottomWidth: 6,
        width: '50%',
        marginTop: -1,
    },
    noneSelectedLine: {
        borderBottomColor: 'rgba(255,255,255,0)',
        borderBottomWidth: 6,
        width: '50%',
        marginTop: -1,
    },
    midCont: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textInputCont: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.lightTint,
    },
    errorText: {
        marginHorizontal: 5,
        marginTop: 10,
        color: colors.lightTint,
        fontSize: 15,
    },
    input: {
        marginTop: 30,
        width: '92%',
        height: 50,
        borderRadius: 5,
        padding: 10,
        color: colors.textColor,
        fontSize: 17,
    },
    button: {
        marginTop: 40,
    },
})

export default DAddYourBirthday