import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/dropdownmenu.module.css'


const DropdownMenu = (props) => {

    const dropdownMenu = useRef();
    const [visible, setVisible] = useState(false);

    useEffect(() => {

        const closeDropDown = (e) =>{
            if (dropdownMenu.current && !dropdownMenu.current.contains(e.target)) {
                setVisible(false);
            }
        }

        document.addEventListener("mousedown", closeDropDown);

        return () =>{
            document.removeEventListener("mousedown", closeDropDown);
        }
    },[]);

    return (
        <div className={styles.dropdownmenu} ref={dropdownMenu} style={props.style}>
            <button className={styles.dropdownbutton} onClick={() => setVisible(!visible)} style={{ backgroundImage: `url(${props.icon})`, width:props.width }}></button>
            <div className={styles.dropdowncontent + " " + (props.direction === "up" ? styles.dropdownup : "")} style={{ visibility: visible ? "visible" : "hidden"}}>
                {
                    props.children
                }
            </div>
        </div>
    )
}

export default DropdownMenu;