import React, { useEffect, useRef } from 'react'
import styles from '../css/togglebutton.module.css'

const ToggleButton = (props) => {

    return (
        <>
            <input className={styles.togglebutton} type="radio" name={props.name} id={props.value} value={props.value} onChange={props.onChange} defaultChecked={props.checked}/>
            <label className={styles.togglelabel} htmlFor={props.value} id={props.id} onMouseDown={props.onMouseDown} style={{ backgroundImage: `url(${props.icon})`, width: props.width }}></label>
        </>
    )
}

export default ToggleButton;