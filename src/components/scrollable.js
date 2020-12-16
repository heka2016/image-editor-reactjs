import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/scrollable.module.css'
import {chevronDownIcon, chevronUpIcon, chevronLeftIcon, chevronRightIcon} from '../icons'

const Scrollable = (props) => {

    const contentRef = useRef();
    let isScrolling = false;
  
    const handleScrolling = (dir) => {
        if (contentRef.current) {
            isScrolling = true;

            if(props.direction === "column"){
                
                scroll(0, 10 * dir)
            }else{
                
                scroll( 10 * dir, 0)
            }

        }
    }

    const mouseWheel = (e) => {
        scroll(0, e.deltaY * 10);
    }

    const scroll = (dx, dy) => {
        const x = contentRef.current.scrollLeft + dx;
        const y = contentRef.current.scrollTop + dy;
        contentRef.current.scroll({
            top: y,
            left: x,
            behavior: 'smooth'
        });
        if (isScrolling) requestAnimationFrame(() => scroll(dx,dy));
    }

    return (
        <div className={`${styles.scrollable} ${props.direction === "column" ? styles.flexDirectionColumn : styles.flexDirectionRow}`}>
            <button style={{backgroundImage:`url(${props.direction  === "column" ? chevronUpIcon : chevronLeftIcon})`}} onPointerDown={()=>handleScrolling(-1)} onPointerUp={() => isScrolling = false}></button>
            
            <div ref={contentRef} className={`${styles.content}`} onWheel={mouseWheel}>
                <div className={`${props.direction === "column" ? styles.flexDirectionColumn : styles.flexDirectionRow}`} style={{display:'flex', flex:1, minHeight:'100%', minWidth:'100%'}}>
                    {
                        props.children
                    }
                </div>
            </div>
            
            <button style={{backgroundImage:`url(${props.direction  === "column" ? chevronDownIcon : chevronRightIcon})`}} onPointerDown={()=>handleScrolling(1)} onPointerUp={() => isScrolling = false}></button>
        </div>
    );
}


export default Scrollable;