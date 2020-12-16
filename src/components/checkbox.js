import React, { useEffect, useRef } from 'react'
import styles from '../css/checkbox.module.css'

const Checkbox = (props) => {


    return (
        <label className={styles.container}>
            {props.label}
            <input className={styles.checkbox} defaultChecked={props.checked} type="checkbox" onClick={props.onClick} />
            <span className={styles.checkmark}></span>
        </label>
    )
}


export default Checkbox;