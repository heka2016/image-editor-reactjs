import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/container.module.css'

const Container = (props) => {

    return (
        <div className={styles.container} onFocus={props.onFocus} onBlur={props.onBlur} tabIndex={props.tabIndex}
            style={{
                width: props.width,
                height: props.height,
                flexDirection: props.direction,
                backgroundColor: props.backgroundColor,
                flexGrow: props.grow,
                overflow: props.overflow,
                justifyContent: props.justifyContent ? props.justifyContent : 'auto',
                alignItems: props.alignItems ? props.alignItems : 'auto',
                textAlign: props.textAlign ? props.textAlign : 'auto',
                visibility: props.hidden ? 'hidden' : '',
                border: props.outline ? '1px solid red' : 'none',
                padding: props.padding ? props.padding : 'auto'
            }}>
            {props.children}
        </div>
    )
}

export default Container;