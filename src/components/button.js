import React, { useEffect, useRef } from 'react'
import styles from '../css/button.module.css'

const Button = (props) => {
    
    return <button className={styles.button} onClick={props.onClick}>{props.text}</button>
}


export default Button;