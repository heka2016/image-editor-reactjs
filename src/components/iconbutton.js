import React, { useEffect, useRef } from 'react'
import styles from '../css/iconbutton.module.css'

const IconButton = (props) => {

    
    return <button className={styles.iconbutton} onClick={props.onClick} style={{backgroundImage:props.icon ? `url(${props.icon})` : "", width:props.width, ...props.style}}>{props.text}</button>
}


export default IconButton;