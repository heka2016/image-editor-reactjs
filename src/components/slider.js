import React, { useState, useEffect, useRef } from 'react'
import styles from '../css/slider.module.css'

const Slider = (props) => {
    

    return (
        <div className={styles.container}>
            <input className={styles.slider} type="range" min={props.min} step={props.step} max={props.max} onInput={(e) => props.onInput(e.target.value)} defaultValue={props.value} style={{ width: props.width }} />
        </div>
    )
}

export default Slider;