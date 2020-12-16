import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/panel.module.css'

const Panel = (props) => {



    return (
        <div className={styles.panel + " " + styles[props.position] } style={{visibility:props.open ? "visible" : "hidden", width:props.width, height:props.height}}>
            {
                props.children
            }
        </div>
    )
}

export default Panel;