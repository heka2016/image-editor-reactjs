import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/dialog.module.css'

const Dialog = (props) => {

    const [open, setOpen] = useState(props.open);

    const {beforeOpen} = props;
    useEffect(() => {
        if(beforeOpen && props.open) beforeOpen();
        setOpen(props.open);
    }, [props.open, beforeOpen])


    return (
        <div className={styles.background} style={{ visibility: open ? "visible" : "hidden" }}>
            <div className={styles.dialog} >
                <div className={styles.title}>{props.title}</div>
                {/* <h4>{props.title}</h4> */}
                {props.children}
            </div>
        </div>
    )
}


export default Dialog;