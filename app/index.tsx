import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const index = () => {
    const user =true
    if(user){
        return <Redirect href={'/(tab)/home'}/>
    }
  return <Redirect href='/login'/>
}

export default index