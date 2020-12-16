import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/canvas.module.css'
import { getPointerPosition } from '../utils/utils'
import { ContextWebGL, Context2d } from '../utils/graphics'
import backgroundImage from '../img/canvasbg.png'
import db from '../utils/db'

const Canvas = (props) => {

    const myCanvas = useRef();
    const ctx = useRef();
    const [imageId, setImageId] = useState(props.imageId);
    const [imageName, setImageName] = useState(props.imageName);
    const [tool, setTool] = useState(props.tool);

    let pointer = {
        current: { x: 0, y: 0 },
        previous: { x: 0, y: 0 }
    }

    const { getImage, getContext } = props;

    useEffect(() => {
        if (myCanvas.current) {
            if (getImage) getImage(myCanvas.current);
        }
    }, [getImage]);


    useEffect(() => {
        if (ctx.current) {
            if (getContext) getContext(ctx.current);
        }
    }, [getContext]);

    useEffect(() => {
        if (myCanvas.current) {
            if (props.width !== 0 && props.height !== 0) {
                const canvas = myCanvas.current;
                ctx.current = props.useWebgl ? ContextWebGL(canvas, { antialias: false, preserveDrawingBuffer: true, desynchronized: false, alpha: true }) : Context2d(canvas, { desynchronized: false });
            }

        }

    }, [props.width, props.height, props.useWebgl]);

    // handle zoom change
    useEffect(() => {
        if (myCanvas.current) {
            const canvas = myCanvas.current;
            canvas.style.width = canvas.width * props.zoom + "px";
            canvas.style.height = canvas.height * props.zoom + "px";
        }
    }, [props.zoom])

    // handle draw state change
    useEffect(() => {
        setTool(props.tool);
    }, [props.tool]);


    // handle image load
    useEffect(() => {
        if (myCanvas.current) {
            if (props.fromImage != null) {

                if (ctx.current) ctx.current.drawImage(props.fromImage, 0, 0);

            } else {
                if (ctx.current) ctx.current.clear();
            }
        }
    }, [props.fromImage])

    useEffect(()=>{
        setImageName(props.imageName);
    },[props.imageName])

    useEffect(()=>{
        setImageId(props.imageId);
    },[props.imageId])
    const pointerDown = (e) => {
        /* alert(e.pointerType) */
        if (e.button === 0) {
            pointer.current = getPointerPosition(e);

            if (ctx.current) {
                if (tool.name === "fill") {
                    ctx.current.floodFill(Math.floor(pointer.current.x), Math.floor(pointer.current.y), tool.color);
                } else {
                    ctx.current.drawRectangle(Math.floor(pointer.current.x), Math.floor(pointer.current.y), tool.size, tool.size, tool.color);

                }
            }
        }
    }

    const storeImage = async () => {
        try {
            const imageData = ctx.current.getImageData();
            console.log("image id: " +imageId);
            const result = await db.images.update(imageId,{ 
                thumbnail: ctx.current.getThumbnail(64),
                data: imageData.data
            });
        } catch (error) {
            console.log(error)
        }

    }

    const pointerUp = (e) => {
        storeImage();
    }

    const pointerMove = (e) => {

        if (tool.name !== "fill") {

            if (e.buttons === 1) {

                let events = 'getCoalescedEvents' in e.nativeEvent ? e.nativeEvent.getCoalescedEvents() : [e];

                for (let e of events) {

                    pointer.previous.x = pointer.current.x;
                    pointer.previous.y = pointer.current.y;
                    pointer.current = getPointerPosition(e);
                    if (ctx.current) ctx.current.drawLine(Math.floor(pointer.current.x), Math.floor(pointer.current.y), Math.floor(pointer.previous.x), Math.floor(pointer.previous.y), tool.size, tool.color);
                }
            }

        }

    }

    const pointerEnter = (e) => {
        pointer.current = getPointerPosition(e);
    }


    if (props.width === 0 && props.height === 0)
        return null
    else
        return (
            <div className={styles.container} >
                <canvas
                    className={styles.canvas}
                    ref={myCanvas}
                    width={props.width}
                    height={props.height}
                    onPointerDown={pointerDown}
                    onPointerUp={pointerUp}
                    onPointerMove={pointerMove}
                    onPointerEnter={pointerEnter}
                    style={{ backgroundImage: `url(${backgroundImage})` }}>

                </canvas>
            </div>
        )
}

export default Canvas;