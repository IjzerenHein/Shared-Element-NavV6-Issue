import AsyncStorage from '@react-native-async-storage/async-storage'
export const ADD_EMAIL = 'ADD_EMAIL'
export const ADD_PHONE = 'ADD_PHONE'
export const ADD_FIRSTNAME = 'ADD_ADD_FIRSTNAME'
export const ADD_LASTNAME = 'ADD_LASTNAME'
export const ADD_PASSWORD = 'ADD_ADD_PASSWORD'
export const ADD_BIRTHDAY = 'ADD_BIRTHDAY'
export const ADD_USERNAME = 'ADD_USERNAME'
export const SIGN_UP = 'SIGN_UP'
export const LOGIN = 'LOGIN'
export const SET_USER_ID = 'SET_USER_ID'
export const EMAIL_CODE = 'EMAIL_CODE'
export const TEXT_CODE = 'TEXT_CODE'
export const CHANGE_AVATAR = 'CHANGE_AVATAR'
export const SEARCH = 'SEARCH'
export const LOAD_PROFILE = 'LOAD_PROFILE '
export const FOLLOW = 'FOLLOW'
export const UNFOLLOW = 'UNFOLLOW'
export const EMPTY_PROFILE = 'EMPTY_PROFILE'
export const LOAD_FOLLOWINGS = 'LOAD_FOLLOWINGS'
export const EDIT_PROFILE = 'EDIT_PROFILE'
export const PRIVACY_UPDATE = 'PRIVACY_UPDATE'
export const LOAD_REQUESTS = 'LOAD_REQUESTS'

//models
import { Search } from '../../models/SearchModel'
import { Gallery } from '../../models/GalleryModel'
import { Follows } from '../../models/FollowsModel'
import { RequestModel } from '../../models/RequestModel'

//Gallery Actions
import { setGalleries } from '../event/action'

import { LINK } from '../../utilities/apiLink'

export const addEmail = (email) => {
    return {
        type: ADD_EMAIL,
        emailAdded: email,
    }
}

export const addPhone = (phone) => {
    return {
        type: ADD_PHONE,
        phoneAdded: phone,
    }
}

export const addFirstName = (name) => {
    return {
        type: ADD_FIRSTNAME,
        nameAdded: name,
    }
}

export const addLastName = (lastName) => {
    return {
        type: ADD_LASTNAME,
        lastNameAdded: lastName,
    }
}

export const addPassword = (password) => {
    return {
        type: ADD_PASSWORD,
        passwordAdded: password,
    }
}

export const addBirthday = (birthday) => {
    return {
        type: ADD_BIRTHDAY,
        birthdayAdded: birthday,
    }
}

export const addUsername = (username) => {
    return {
        type: ADD_USERNAME,
        usernameAdded: username,
    }
}

export const signupUser = () => {
    return async (dispatch, getState) => {
        const userName = getState().signupReducer.signupInfo.username
        const password = getState().signupReducer.signupInfo.password
        const phone =
            getState().signupReducer.signupInfo.phoneNumber.length > 2
                ? getState().signupReducer.signupInfo.phoneNumber
                : ''
        const email =
            getState().signupReducer.signupInfo.email.length > 2
                ? getState().signupReducer.signupInfo.email
                : ''
        const firstName = getState().signupReducer.signupInfo.firstName
        const lastName = getState().signupReducer.signupInfo.lastName

        const body = JSON.stringify({
            userName,
            password,
            phone,
            email,
            firstName,
            lastName,
        })
        console.log('🚀 ~ file: actions.js ~ line 82 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&registeration=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })
            const responseData = await response.json()
            console.log(
                '🚀 ~ file: actions.js ~ line 103 ~ return ~ responseData',
                responseData
            )

            const cantRegister =
                responseData.message?.user?.registeration?.error

            if (cantRegister) {
                throw new Error('Something went wrong!')
            }

            const newUserID = responseData.message?.userData?.uniqID
            console.log(
                '🚀 ~ file: actions.js ~ line 116 ~ return ~ newUserID',
                newUserID
            )
            await storeData(newUserID)

            dispatch({
                type: SIGN_UP,
                newUserID: newUserID,
            })
        } catch {
            throw error
        }
    }
}

export const login = (username, password) => {
    return async (dispatch, getState) => {
        let userID
        const body = JSON.stringify({
            userName: username,
            password,
        })
        try {
            const response = await fetch(`${LINK}&auth=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                const errorMessage = data.message?.user.authCheck === 'ERROR'
                if (errorMessage) {
                    throw new Error('Incorrect Credentials')
                }

                const userID = data.message?.userData?.basic?.uniqueID
                const userInfo = data.message?.userData
                const credentials = data.message?.userData?.body

                dispatch({
                    type: LOGIN,
                    userID: userID,
                    fullInfo: userInfo,
                })

                dispatch(setGalleries(userID))

                await storeCredentials(
                    credentials.userName,
                    credentials.password,
                    userID
                )
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const setUserID = (userID) => {
    return {
        type: SET_USER_ID,
        userID: userID,
    }
}

export const sendEmailCode = (email) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            email,
        })
        try {
            const response = await fetch(`${LINK}&validationEmail=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                code = data?.message?.code

                const errorCode = data.message?.error
                if (errorCode) {
                    throw new Error('The entered email address is not valid.')
                }
            } catch (error) {
                throw error
            }

            dispatch({
                type: EMAIL_CODE,
                emailCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}

export const sendTextCode = (phone) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            phone,
        })
        try {
            const response = await fetch(`${LINK}&validationSMS=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                code = data.message.code

                const errorCode = data.message.error
                if (errorCode) {
                    throw new Error('The entered phone number is not valid.')
                }
            } catch (error) {
                throw new Error('Something went wrong!')
            }

            dispatch({
                type: TEXT_CODE,
                textCode: code,
            })
        } catch (error) {
            throw error
        }
    }
}

export const checkUserExistence = (userName) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            userName,
        })
        try {
            const response = await fetch(`${LINK}&check-userName=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 320 ~ return ~ data',
                    data
                )

                const userExists = data.message?.userNameCheck?.error
                if (userExists) {
                    throw new Error('This username is unavailable.')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const checkEmailExistence = (email) => {
    return async (dispatch, getState) => {
        const body = JSON.stringify({
            email,
        })
        try {
            const response = await fetch(`${LINK}&check-email=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 245 ~ return ~ data',
                    data
                )
                const emailExists = data.message?.emailCheck?.error
                if (emailExists) {
                    throw new Error('This email is unavailable.')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const changeAvatar = (avatar) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
            avatar,
        })
        console.log('🚀 ~ file: actions.js ~ line 407 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&change-avatar=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 408 ~ return ~ data',
                    data
                )

                if (data.message?.response === 'success') {
                    const avatarThumbPath = data.message.avatarThumb
                    const avatarFullPath = data.message.avatar

                    dispatch({
                        type: CHANGE_AVATAR,
                        avatarThumbPath,
                        avatarFullPath,
                    })
                    return
                } else {
                    throw new Error('Something went wrong!')
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const search = (text) => {
    return async (dispatch, getState) => {
        // const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userName: text,
        })
        try {
            const response = await fetch(`${LINK}&search-profile=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const searches = data.message.data

                const loadedSearches = []
                for (const key in searches) {
                    loadedSearches.push(
                        new Search(
                            searches[key].uniqueID,
                            searches[key].userName,
                            searches[key].firstName,
                            searches[key].lastName,
                            searches[key].avatar
                        )
                    )
                }

                dispatch({
                    type: SEARCH,
                    searches: loadedSearches,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const loadProfile = (userID) => {
    return async (dispatch, getState) => {
        // const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
        })
        // console.log('🚀 ~ file: actions.js ~ line 496 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&get-user=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const loadedProfile = data.message.data
                // console.log(
                //     '🚀 ~ file: actions.js ~ line 509 ~ return ~ loadedProfile',
                //     loadedProfile
                // )

                dispatch({
                    type: LOAD_PROFILE,
                    loadedProfile: loadedProfile,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const emptyProfile = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: EMPTY_PROFILE,
                loadedProfile: null,
            })
        } catch (error) {
            throw error
        }
    }
}

export const followUnfollow = (followID, followType) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        let link = `${LINK}&follow-user=1`

        if (followType === 'unFollow') {
            link = `${LINK}&unfollow-user=1`
        }

        const body = JSON.stringify({
            userID: followID,
            followerID: userID,
        })
        console.log('🚀 ~ file: actions.js ~ line 561 ~ return ~ body', body)

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                const results = data.message.response
                console.log(
                    '🚀 ~ file: actions.js ~ line 581 ~ return ~ results',
                    results
                )

                if (results === 'success') {
                    dispatch({
                        type: UNFOLLOW,
                    })
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const loadFollowersFollowing = (userID, followType) => {
    return async (dispatch, getState) => {
        let link = `${LINK}&get-user-followings=1`

        if (followType === 'followers') {
            link = `${LINK}&get-user-followers=1`
        }

        const body = JSON.stringify({
            userID: userID,
        })

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                const follows = data.message?.data

                const loadedFollows = []
                for (const key in follows) {
                    loadedFollows.push(
                        new Follows(
                            follows[key].avatarFullPath,
                            follows[key].avatarThumbPath,
                            follows[key].firstName,
                            follows[key].lastName,
                            follows[key].userID,
                            follows[key].userName
                        )
                    )
                }

                dispatch({
                    type: LOAD_FOLLOWINGS,
                    followings: loadedFollows,
                })
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const editProfile = (
    firstName,
    lastName,
    birthDate,
    phone,
    username
) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        const firstNamePassed =
            firstName === null
                ? getState().signupReducer.userInfo.firstName
                : firstName
        const lastNamePassed =
            lastName === null
                ? getState().signupReducer.userInfo.lastName
                : lastName
        const birthDatePassed =
            birthDate === null
                ? getState().signupReducer.userInfo.birthday
                : birthDate
        const phonePassed =
            phone === null ? getState().signupReducer.userInfo.phone : phone
        const usernamePassed =
            username === null
                ? getState().signupReducer.userInfo.username
                : username

        const link = `${LINK}&edit-profile=1`

        const body = JSON.stringify({
            userID: userID,
            firstName: firstNamePassed,
            lastName: lastNamePassed,
            birthDate: birthDatePassed,
            phone: phonePassed,
            userName: usernamePassed,
        })
        console.log('🚀 ~ file: actions.js ~ line 685 ~ return ~ body', body)

        try {
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                console.log('no response from server')
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()

                const userProfileData = data.message?.userProfileData
                console.log(
                    '🚀 ~ file: actions.js ~ line 712 ~ return ~ userProfileData',
                    userProfileData
                )
                const errorMessage = data.message?.response === 'error'

                if (!userProfileData || errorMessage) {
                    throw new Error('Something went wrong!')
                }

                dispatch({
                    type: EDIT_PROFILE,
                    userProfileData: userProfileData,
                    username: usernamePassed,
                })

                if (username) {
                    storeNewUsername(username)
                }
            } catch (error) {
                throw error
            }
        } catch (error) {
            throw error
        }
    }
}

export const privacyChange = (privacy) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
            accountPrivacy: privacy,
        })
        try {
            const response = await fetch(`${LINK}&account-privacy=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 770 ~ return ~ data',
                    data
                )
                const success = data.message.response === 'success'

                if (success) {
                    dispatch({
                        type: PRIVACY_UPDATE,
                        privacy: privacy,
                    })
                }
            } catch (error) {
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            throw error
        }
    }
}

export const getFollowRequests = () => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID
        const body = JSON.stringify({
            userID,
        })
        try {
            const response = await fetch(`${LINK}&get-follow-requests=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 769 ~ return ~ data',
                    data
                )
                const requests = data.message.data
                const loadedRequests = []
                for (const key in requests) {
                    loadedRequests.push(
                        new RequestModel(
                            requests[key].avatar,
                            requests[key].firstName,
                            requests[key].lastName,
                            requests[key].uniqueID,
                            requests[key].userName
                        )
                    )
                }

                dispatch({
                    type: LOAD_REQUESTS,
                    friendRequests: loadedRequests,
                })
            } catch (error) {
                console.log(error)
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            throw error
        }
    }
}

export const friendRequestResponse = (followerID, status) => {
    return async (dispatch, getState) => {
        const userID = getState().signupReducer.userInfo.userID

        const body = JSON.stringify({
            userID,
            followerID,
            status: status,
        })
        console.log('🚀 ~ file: actions.js ~ line 861 ~ return ~ body', body)
        try {
            const response = await fetch(`${LINK}&follow-accept-reject=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    key: 'ThisIsASecretKey',
                },
                body: body,
            })

            if (!response.ok) {
                throw new Error('Something went wrong!')
                // OR below you can pass the error status.
                throw new Error(response.status.toString())
            }

            try {
                const data = await response.json()
                console.log(
                    '🚀 ~ file: actions.js ~ line 770 ~ return ~ data',
                    data
                )
                const success = data.message.response === 'success'

                if (!success) {
                    throw new Error('Something went wrong!')
                }

                dispatch({
                    type: FOLLOW_RESPONSE,
                })
            } catch (error) {
                throw new Error('Something went wrong!')
            }
        } catch (error) {
            throw error
        }
    }
}
// helpers
const storeData = async (value) => {
    try {
        await AsyncStorage.removeItem('userID')
        await AsyncStorage.setItem('userID', value)
    } catch (e) {
        console.log(e)
        // throw error
    }
}

const storeCredentials = async (username, password, userID) => {
    try {
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('password', password)
        await AsyncStorage.setItem('userID', userID)
    } catch (error) {
        console.log(error)
        throw error
    }
}

const storeNewUsername = async (username) => {
    try {
        await AsyncStorage.setItem('username', username)
    } catch (error) {
        console.log(error)
        throw error
    }
}
