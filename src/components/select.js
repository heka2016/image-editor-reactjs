import React, { useEffect, useRef } from 'react'
import styles from '../css/select.module.css'

const Select = (props) => {

    
    return (
        <select className={styles.select} onChange={(e) => props.onChange(e.target.value)}>
            {
                props.options.map((option, index) =>{

                return <option key={index} value={option.value}>{option.name}</option>
                })
            }
        </select>
    );
}


export default Select;