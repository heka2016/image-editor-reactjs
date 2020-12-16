import React, { useEffect, useRef } from 'react'
import styles from '../css/text.module.css'

const Text = (props) => {


    return (
        <span className={styles.text} style={{fontSize:props.fontSize, fontWeight:props.fontWeight}}>
            {props.children}
        </span>
    )
}


export default Text;