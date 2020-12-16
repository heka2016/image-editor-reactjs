import React, { useEffect, useRef } from 'react'
import styles from '../css/animationframe.module.css'
import backgroundImage from '../img/canvasbg.png'

const AnimationFrame = (props) => {

    const canvasRef = useRef();
    const ctxRef = useRef();

    useEffect(() => {
        if (canvasRef.current) {
            ctxRef.current = canvasRef.current.getContext("2d");
            ctxRef.current.imageSmoothingEnabled = false;
        }
    }, [])


    useEffect(() => {
        if (ctxRef.current) {

            if (props.src) {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = props.src.width;
                tempCanvas.height = props.src.height;
                const tempCtx = tempCanvas.getContext("2d");
                tempCtx.putImageData(props.src, 0, 0);
                ctxRef.current.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvasRef.current.width, canvasRef.current.height);

            }
        }
    }, [props.src])

    return (
        <canvas className={styles.animationframe} ref={canvasRef} width={props.width} height={props.height} style={{ backgroundImage: `url(${backgroundImage})` }}></canvas>
    );
}


export default AnimationFrame;