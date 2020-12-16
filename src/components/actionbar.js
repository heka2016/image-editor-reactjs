import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/actionbar.module.css'

const ActionBar = (props) => {

    return <div className={styles.actionbar} style={{height:props.height,flexDirection:props.vertical ? "column" : "row"}}>{props.children}</div>
}

export default ActionBar;