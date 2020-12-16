import React, {useRef,useState, useEffect} from 'react'
import styles from '../css/animationplayer.module.css'

const AnimationPlayer = (props) =>{

    const canvasRef = useRef();
    const ctxRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [animationFrames, setAnimationFrames] = useState(props.frames);

    let currentFrame = 0;
    let paused = false;
    let frameDuration = 1 / 60.0;
    let currentTime = 0;
    let previousTime = 0;
    
    const {play, stop} = props;

    useEffect(()=>{
        ctxRef.current = canvasRef.current.getContext("2d");
    },[]);

    useEffect(()=>{
        setAnimationFrames(props.frames);
    },[props.frames])

    useEffect(()=>{
        if(play) {
            if(!isPlaying) {
                setIsPlaying(true);
                requestAnimationFrame(animationLoop);
            }
        }
    },[play, isPlaying])


    const animationLoop = (timestamp) => {
        currentTime = timestamp;
        if ((currentTime - previousTime) / 1000 >= frameDuration) {
            previousTime = currentTime;
            const canvas = canvasRef.current;
            ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);            
            ctxRef.current.putImageData(animationFrames[currentFrame], canvas.width / 2 - animationFrames[currentFrame].width / 2,canvas.height / 2 - animationFrames[currentFrame].height / 2)
            // ctxRef.current.drawImage(animationFrames[currentFrame], canvas.width / 2 - animationFrames[currentFrame].width / 2, canvas.height / 2 - animationFrames[currentFrame].height / 2, animationFrames[currentFrame].width, animationFrames[currentFrame].height);

            currentFrame++;

        }

        if (currentFrame < animationFrames.length)
            requestAnimationFrame(animationLoop);
       
    }


    return (
        <div className={styles.container} style={{width:`${props.width}px`, height:`${props.height}px`}}>
            <canvas className={styles.canvas} ref={canvasRef} width={props.width} height={props.height}></canvas>
        </div>
    );

}


export default AnimationPlayer;