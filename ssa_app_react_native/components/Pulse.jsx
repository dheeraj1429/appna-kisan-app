import React from 'react'
import {StyleSheet} from "react-native"
import Pulse from 'react-native-pulse';

const AnimatedPulse = ({color,numOfPulse,diameter}) => {
    return  <Pulse color={color}  numPulses={numOfPulse} diameter={diameter} speed={26} duration={2000} />
  };

export default AnimatedPulse;

