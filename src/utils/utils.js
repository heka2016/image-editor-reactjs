const openImage = (fn) => {
    let input = document.createElement('input');
    input.type = "file";
    input.accept = "image/*";

    input.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let img = new Image();
            img.src = content;
            img.onload = () => fn(img);
            img.onerror = (error) => fn(error)
        }
    }

    input.click();

}



const getPointerPosition = (e) => {
    const element = e.target;
    const rect = element.getBoundingClientRect();

    return {
        x: (e.clientX - rect.left) / (rect.right - rect.left) * element.width,
        y: (e.clientY - rect.top) / (rect.bottom - rect.top) * element.height,
    }
}

const downloadImage = (filename, dataurl ) =>{
    const a = document.createElement("a");
    a.download = filename;
    a.href = dataurl;
    a.click();
}

export { openImage, getPointerPosition, downloadImage };