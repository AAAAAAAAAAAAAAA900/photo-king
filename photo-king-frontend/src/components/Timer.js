import { Animated, useAnimatedValue, View } from "react-native";
import styles, { colors } from '../styles/ComponentStyles.js';
import { useEffect, useRef, useState } from "react";
import DefaultText from "./DefaultText.js";

// start time given in seconds
export default function Timer({startTime = 60, onComplete}){
    const interval = useRef(null);
    const [time, setTime] = useState(startTime);
    const numberFormat = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2});

    const formatTime = (seconds) => {
        let m = Math.floor(seconds/60);
        let s = seconds%60;
        let h = Math.floor(m/60);
        m = m%60;
        return `${numberFormat.format(h)}:${numberFormat.format(m)}:${numberFormat.format(s)}`;
    }

    useEffect(() => {
        // update timer text every second
        interval.current = setInterval(()=>{
            setTime((prev)=>{
                if (prev <= 1) {    // timer complete check
                    if(onComplete)
                        onComplete();
                    clearInterval(interval.current);
                    return 0;
                } 
                return prev-1;
            });
        }, 1000);

        // clear interval on unmount
        return ()=> {if(interval.current) clearInterval(interval.current);};
    }, []);

    return(
        <View>
            <DefaultText style={{fontFamily: 'DMSans-Bold'}}>
                {formatTime(time)}
            </DefaultText>
        </View>
    );
}