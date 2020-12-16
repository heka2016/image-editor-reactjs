import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/inputfield.module.css'

const InputField = (props) => {

    return <input className={styles.inputfield} type="text" inputMode={props.mode} defaultValue={props.value} onInput={(e) => props.onInput(e.target.value)} />
}


export default InputField;