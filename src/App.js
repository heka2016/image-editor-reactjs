import React, { useState, useRef, useEffect } from 'react';
import { isMobile, withOrientationChange, isTablet, isMobileOnly } from 'react-device-detect';
import Canvas from './components/canvas'
import IconButton from './components/iconbutton'
import logo from './logo.svg';
import dropboxLogo from './dropbox.svg';
import './App.css';
import Dialog from './components/dialog';
import DropdownMenu from './components/dropdownmenu';
import InputField from './components/inputfield';
import ActionBar from './components/actionbar';
import Container from './components/container';
import ToggleButtonGroup from './components/togglebuttongroup';
import ToggleButton from './components/togglebutton';
import Slider from './components/slider';
import Color from './components/color';
import Panel from './components/panel';
import { Dropbox } from 'dropbox'
import * as shortid from 'shortid';
import Scrollable from './components/scrollable';
import Spinner from './components/spinner';
import { openImage, downloadImage } from './utils/utils';
import * as icons from './icons';
import Button from './components/button';
import Checkbox from './components/checkbox';
import Select from './components/select';
import AnimationPlayer from './components/animationplayer';
import Text from './components/text';
import AnimationFrame from './components/animationframe';
import db from './utils/db';
import backgroundImage from './img/canvasbg.png'

const App = (props) => {

  const { isLandscape, isPortrait } = props;
  const buttonWidth = 55;
  const [imagePreset, setImagePreset] = useState("16");
  const accessToken = '';

  useEffect(() => {

    const listFiles = async () => {
      try {
        const dbx = new Dropbox({ accessToken, fetch });

        setSpinnerVisible(true);
        let response = await dbx.filesListFolder({ path: '' });
        let file = await dbx.filesDownload({ path: '/test.png' });

        var img = document.createElement('img');
        img.src = window.URL.createObjectURL(file.fileBlob);
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setCanvasImage(img);
          setSpinnerVisible(false);
        }
      } catch (error) {
        console.log(error);
      }

    }

    /*
     console.log(window.location.hash)
     const params = new URLSearchParams(window.location.hash.substr(1));
     const foo = params.get("access_token"); 
     console.log(foo)
     console.log(JSON.parse(params.get("state"))) */

    //listFiles();
  }, []);


  const getImages = async () => {
    try {
      const images = await db.images.toArray();
      //console.log(images)
      setImages(images);
    } catch (error) {
      console.log(error)
    }
  }


  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [animationPlayerDialogOpen, setAnimationPlayerDialogOpen] = useState(false);
  const [openImageDialogOpen, setOpenImageDialogOpen] = useState(false);
  const [dropboxDialogOpen, setdropboxDialogOpen] = useState(false);
  const [createImageDialogOpen, setCreateImageDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [colorPickerDialogOpen, setColorPickerDialogOpen] = useState(false);
  const [palettePanelOpen, setPalettePanelOpen] = useState(false);
  const [animationPanelOpen, setAnimationPanelOpen] = useState(false);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);

  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imageName, setImageName] = useState("new image");

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [menuImage, setMenuImage] = useState(icons.penIcon);
  const [customWidth, setCustomWidth] = useState(0);
  const [customHeight, setCustomHeight] = useState(0);


  const [redValue, setRedValue] = useState(0);
  const [blueValue, setBlueValue] = useState(0);
  const [greenValue, setGreenValue] = useState(0);
  const [alphaValue, setAlphaValue] = useState(255);
  const [zoomValue, setZoomValue] = useState(1);

  const [useWebgl, setUseWebgl] = useState(true);
  const [canvasImage, setCanvasImage] = useState(null);
  const [canvasTool, setCanvasTool] = useState({
    name: "pen",
    color: 0xFF000000,
    size: 1,
  });


  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [animationFrames, setAnimationFrames] = useState([]);
  const [context, setContext] = useState(null);
  const [spinnerVisible, setSpinnerVisible] = useState(false);

  const [palette, setPalette] = useState([
    /* 0xFF0000FF, 0xFF00FFFF, 0xEECC00FF, 0xFF1122EE */
  ]);


  const addToPalette = () => {
    let color = (alphaValue << 24) | (blueValue << 16) | (greenValue << 8) | (redValue);

    setPalette([...palette, color]);
  }

  const setDrawColor = (value) => {
    setCanvasTool({ ...canvasTool, color: value })
  }

  const deleteColor = (index) => {

    // make copy of palette
    const temp = palette.slice();
    // remove color from palette at index position
    temp.splice(index, 1);
    setPalette(temp);
  }

  const getImage = (image) => {
    
    setImage(image);
  }


  const setZoom = (value) => {

    setZoomValue(value);
  }

  const createImage = () => {
    //TODO indexeddb

    if (imagePreset === "16" || imagePreset === "32" || imagePreset === "64" || imagePreset === "128" || imagePreset === "256" || imagePreset === "512" || imagePreset === "1024") {
      setHeight(imagePreset);
      setWidth(imagePreset);
    } else if (imagePreset === "720p") {
      setWidth(1280);
      setHeight(720);
    } else if (imagePreset === "1080p") {
      setWidth(1920);
      setHeight(1080);
    } else if (imagePreset === "custom") {
      setWidth(customWidth);
      setHeight(customHeight);
    }

    setCanvasImage(null);
    storeImage();
    setCreateImageDialogOpen(false);
  }


  const storeImage = async () => {
    try {
      const id = await db.images.add({
        name: imageName,
        width: width,
        height: height,
        thumbnail: null,
        data: null
      });
      //console.log(id);
      setImageId(id);

    } catch (error) {
      console.log(error)
    }

  }


  const download = () => {
    if (image) {
      downloadImage(imageName, image.toDataURL())
    }
  }

  const onImageLoaded = (img) => {
    setWidth(img.width)
    setHeight(img.height)
    setCanvasImage(img);
    setSpinnerVisible(false);
  }

  const dropboxAuthenticate = () => {
/* 
    const dbx = new Dropbox({ fetch: fetch, clientId: '' });
    let authUrl = dbx.getAuthenticationUrl('https://px2d.herokuapp.com/auth');
    let win = window.open(authUrl, '_blank');
    win.onclose = (e) => {
      //alert(e)
    }
    win.onunload = (e) => {
      //alert(e)
    } */
  }


  const setTool = (value) => {
    if (value === "pen") {
      setCanvasTool({
        name: "pen",
        color: 0xFF000000,
        size: 1,
      });
    } else if (value === "brush") {
      setCanvasTool({
        name: "brush",
        color: 0xFF000000,
        size: 5,
      });
    } else if (value === "eraser") {
      setCanvasTool({
        name: "eraser",
        color: 0x00000000,
        size: 5,
      });
    } else if (value === "fill") {
      setCanvasTool({
        name: "fill",
        color: 0xFF000000,
      });
    }
  }

  return (
    <div className="App" onContextMenu={(e) => e.preventDefault()}>

      <ActionBar >
        <DropdownMenu width={buttonWidth} icon={menuImage} >
          <ToggleButtonGroup name="tool" onChange={(value) => { setMenuImage(icons[`${value}Icon`]); setTool(value); }}>
            <ToggleButton icon={icons.penIcon} checked={true} value="pen" width={buttonWidth} />
            {/*  <ToggleButton icon={icons.brushIcon} value="brush" width={buttonWidth}/> */}
            <ToggleButton icon={icons.eraserIcon} value="eraser" width={buttonWidth} />
            <ToggleButton icon={icons.fillIcon} value="fill" width={buttonWidth} />
          </ToggleButtonGroup>
        </DropdownMenu>
        <IconButton icon={icons.paletteIcon} width={buttonWidth} onClick={() => setPalettePanelOpen(!palettePanelOpen)} />
        <IconButton icon={icons.eyedropIcon} width={buttonWidth} onClick={() => setColorPickerDialogOpen(!colorPickerDialogOpen)} />
        <IconButton icon={icons.undoIcon} width={buttonWidth} onClick={() => { }} />
        <IconButton icon={icons.redoIcon} width={buttonWidth} onClick={() => { }} />
        <IconButton icon={icons.cogIcon} width={buttonWidth} onClick={() => setSettingsDialogOpen(true)} style={{ marginLeft: "auto" }} />
      </ActionBar>

      <Container backgroundColor="#1e2027" direction="column" >
        <Slider min="-40" step="0.01" max="40" value="1" width="200" onInput={(value) => setZoom(value)} />
      </Container>

      <Container overflow="hidden" grow="1">
        <Container overflow="auto" grow="1">
          <Spinner visible={spinnerVisible} />
          <Canvas
            width={width}
            height={height}
            zoom={zoomValue}
            tool={canvasTool}
            imageId={imageId}
            imageName={imageName}
            getImage={getImage}
            fromImage={canvasImage}
            useWebgl={useWebgl}
            getContext={(ctx) => setContext(ctx)} />
          {/*  <Canvas width={100} height={100} zoom={zoom}  getImage={getImage} /> */}
        </Container>

        <Panel position="left" open={palettePanelOpen} height="100%">
          <Container direction="column">
            <Color value={0xFF000000} onClick={(v) => setDrawColor(v)} />
            <Color value={0xFFFFFFFF} onClick={(v) => setDrawColor(v)} />
          </Container>
          <Container overflow="hidden" grow="1">
            <Scrollable direction="column">
              {
                palette.map((value, index) => <Color key={shortid.generate()} value={value} onClick={(v) => setDrawColor(v)} onDelete={() => deleteColor(index)} />)
              }
            </Scrollable>
          </Container>
          <Container direction="column">
            <IconButton icon={icons.diskIcon} width={buttonWidth} />
            <IconButton icon={icons.folderIcon} width={buttonWidth} />
          </Container>
        </Panel>

        <Panel position="bottom" open={animationPanelOpen} width="100%" height="200px">
          <Scrollable direction="row">

            {
              animationFrames.map((frame, index) => <AnimationFrame key={index} width="64" height="64" src={frame} />)
            }

          </Scrollable>
          <Button text="Add current image" onClick={() => { if (context) { setAnimationFrames([...animationFrames, context.getImageData()]) } }} />
          <Container direction="row" justifyContent="flex-end">
            <IconButton icon={icons.playIcon} width={buttonWidth} onClick={() => setAnimationPlayerDialogOpen(true)} />
            <IconButton icon={icons.diskIcon} width={buttonWidth} />
            <IconButton icon={icons.folderIcon} width={buttonWidth} />
          </Container>
        </Panel>
      </Container>

      <ActionBar >
        <IconButton icon={icons.hddIcon} onClick={() => setWelcomeDialogOpen(true)} width={buttonWidth} />
      {/*   <IconButton icon={icons.animationIcon} onClick={() => setAnimationPanelOpen(!animationPanelOpen)} width={buttonWidth} />
        <IconButton icon={icons.layersIcon} onClick={() => setLayersPanelOpen(!layersPanelOpen)} width={buttonWidth} /> */}
       {/*  <DropdownMenu width={buttonWidth} icon={icons.ellipsisHorizontalIcon} direction="up" style={{ marginLeft: "auto" }}>
          <IconButton icon={icons.dropboxIcon} onClick={() => setdropboxDialogOpen(!dropboxDialogOpen)} width={buttonWidth} />
          <IconButton icon={icons.downloadIcon} onClick={() => download()} width={buttonWidth} />
        </DropdownMenu> */}
      </ActionBar>

      <Dialog title="Welcome" open={welcomeDialogOpen}>
        <Container grow="1">
          <img src={logo} alt="logo" width="128" height="128" /* style={{margin:'auto'}}  */ draggable="false" onMouseDown={(e) => { e.preventDefault() }} />
        </Container>
        <Container direction="column">
          <Button text="New image" onClick={() => { setWelcomeDialogOpen(false); setCreateImageDialogOpen(true) }} />
          <Button text="Open image" onClick={() => { setWelcomeDialogOpen(false); setOpenImageDialogOpen(true) }} />
        </Container>
      </Dialog>

      <Dialog title="Open image" open={openImageDialogOpen} beforeOpen={() => getImages()}>
        <div className="scroll" style={{ overflowY: 'scroll', width: '100%', height: '256px' }} >
          
          {images.length > 0 ?
            images.map((image, index) => (
              <Container key={index} alignItems="center" padding="5px 5px" tabIndex="0" onFocus={(e)=>{e.target.style.backgroundColor='teal'}} onBlur={(e)=>{e.target.style.backgroundColor = 'transparent'}}>
                <img src={icons.imgIcon} />
                <Container grow="1" justifyContent="left" padding="0px 10px">
                  <Text> {image.name} </Text>
                </Container>
                <IconButton icon={icons.xmarkIcon} onClick={async () => { await db.images.delete(image.id); getImages(); }} />
              </Container>
            ))
            :
            <div>No images in db</div>
          }
        </div>

        <Container direction="column" grow="1" justifyContent="flex-end">
          <Button text="Open image" onClick={() => {setOpenImageDialogOpen(false); }} />
          <Button text="Open image from file" onClick={() => { setOpenImageDialogOpen(false); setSpinnerVisible(true); openImage(onImageLoaded); }} />
          <Button text="Close" onClick={() => setOpenImageDialogOpen(false)} />
        </Container>
      </Dialog>

      <Dialog title="Dropbox" open={dropboxDialogOpen}>
        <Container grow="1">
          <img src={dropboxLogo} alt="logo" width="128" height="128" draggable="false" onMouseDown={(e) => { e.preventDefault() }} />
        </Container>
        <Container direction="column">
          <Button text="Authenticate" onClick={() => {/* dropboxAuthenticate() */}} />
          <Button text="Close" onClick={() => setdropboxDialogOpen(false)} />
        </Container>
      </Dialog>

      <Dialog title="Animation player" open={animationPlayerDialogOpen}>
        <AnimationPlayer
          width="128"
          height="128"
          frames={animationFrames}
          play={animationPlaying}
          stop="" />
        <Button text="play" onClick={() => setAnimationPlaying(true)} />
        <Button text="close" onClick={() => setAnimationPlayerDialogOpen(false)} />
      </Dialog>

      <Dialog title="Select color" open={colorPickerDialogOpen}>
        <Container direction="column" grow="1" backgroundColor={`rgb(${redValue},${greenValue},${blueValue}, ${alphaValue / 255.0})`} height="200px" />
        <Container alignItems="center">
          <Container width="10%">
            <Text>R</Text>
          </Container>
          <Slider min="0" step="1" max="255" value="0" onInput={(value) => setRedValue(value)} />
          <Container width="10%">
            <Text>{redValue}</Text>
          </Container>
        </Container>
        <Container alignItems="center">
          <Container width="10%">
            <Text>G</Text>
          </Container>
          <Slider min="0" step="1" max="255" value="0" onInput={(value) => setGreenValue(value)} />
          <Container width="10%">
            <Text>{greenValue}</Text>
          </Container>
        </Container>
        <Container alignItems="center">
          <Container width="10%">
            <Text>B</Text>
          </Container>
          <Slider min="0" step="1" max="255" value="0" onInput={(value) => setBlueValue(value)} />
          <Container width="10%">
            <Text>{blueValue}</Text>
          </Container>
        </Container>
        <Container alignItems="center">
          <Container width="10%">
            <Text>A</Text>
          </Container>
          <Slider min="0" step="1" max="255" value="255" onInput={(value) => setAlphaValue(value)} />
          <Container width="10%">
            <Text>{alphaValue}</Text>
          </Container>
        </Container>
        <Button text="select" onClick={() => setDrawColor((alphaValue << 24) | (blueValue << 16) | (greenValue << 8) | (redValue))} />
        <Button text="add to palette" onClick={() => addToPalette()} />
        <Button text="close" onClick={() => setColorPickerDialogOpen(false)} />
      </Dialog>

      <Dialog title="Settings" open={settingsDialogOpen}>
        <Checkbox label="Use webgl context" checked={useWebgl} /* onClick={()=>setUseWebgl(!useWebgl)} */ />
        <Container direction="column" grow="1" justifyContent="flex-end">
          <Button text="close" onClick={() => setSettingsDialogOpen(false)} />
        </Container>
      </Dialog>

      <Dialog title="New image" open={createImageDialogOpen}>
        <Container direction="column" grow="1" justifyContent="flex-start">
          <Text>Image name</Text>
          <InputField value="new image" mode="url" onInput={(text) => setImageName(text)} />
          <Text>Image preset</Text>
          <Select options={[
            { name: "16x16", value: "16" },
            { name: "32x32", value: "32" },
            { name: "64x64", value: "64" },
            { name: "128x128", value: "128" },
            { name: "256x256", value: "256" },
            { name: "512x512", value: "512" },
            { name: "1024x1024", value: "1024" },
            { name: "720p", value: "720p" },
            { name: "1080p", value: "1080p" },
            { name: "custom", value: "custom" }]} onChange={(value) => setImagePreset(value)} />

          <Container direction="column" hidden={imagePreset !== "custom"}>
            <Text fontSize="1.1em" fontWeight="bold">Custom size</Text>
            <Text>Width</Text>
            <InputField mode="numeric" onInput={(value) => setCustomWidth(Number(value))} />
            <Text>Height</Text>
            <InputField mode="numeric" onInput={(value) => setCustomHeight(Number(value))} />
          </Container>
        </Container>

        <Container direction="column">
          <Button text="create" onClick={() => createImage()} />
          <Button text="close" onClick={() => setCreateImageDialogOpen(false)} />
        </Container>
      </Dialog>
    </div>
  );
}

export default withOrientationChange(App);
