import React, { useState, useEffect, useRef } from 'react'
import styles from '../css/color.module.css'

const Color = (props) => {

    const [value, setValue] = useState(props.value);
    let duration = 0    
    let id = null;

    const ABGRToRgbaString = (color) =>{
        const a = (color >> 24) & 0xFF,
        b = (color >> 16) & 0xFF,
        g = (color >> 8) & 0xFF,
        r = color & 0xFF;

        return `rgba(${r},${g},${b},${a / 255.0})`;
    }


    const pointerDown = () =>{
        if(props.onDelete)
            id = setInterval(calculateTime, 100);
    }

    const pointerUp = () =>{
        clearInterval(id); 
        duration = 0
       
    }

    const calculateTime = () =>{
        duration++;
        if(duration >= 15) {
           
            props.onDelete(props.id);
            clearInterval(id);
        }
    }

   


    return (
        <div className={styles.color} tabIndex="0"  style={{backgroundColor:ABGRToRgbaString(value)}}  onPointerDown={pointerDown} onPointerUp={pointerUp} onClick={()=>props.onClick(value)}></div>
    );
}


export default Color;