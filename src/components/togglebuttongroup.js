import React, { useEffect, useRef } from 'react'
import styles from '../css/togglebuttongroup.module.css'

const ToggleButtonGroup = (props) => {

    return (
        <div className={styles.togglebuttongroup}>
            {
                props.children.map((child, index) => {

                    return React.cloneElement(child, {
                        key: index,
                        name: props.name,
                        onChange: (e) => props.onChange(e.target.value),
                    });
                })
            }
        </div>
    )
}

export default ToggleButtonGroup;