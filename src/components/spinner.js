import React, { useState, useEffect, useRef } from 'react'
import styles from '../css/spinner.module.css'

const Spinner = (props) => {

    return (
        <div className={styles.container} style={{ display: props.visible ? 'block' : 'none' }}>
            <div className={styles.spinner}></div>
        </div>
    )

}

export default Spinner;