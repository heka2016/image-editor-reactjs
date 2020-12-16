import * as webgl from './webgl.js'
import * as paint from './paint.js'
import * as shaders from './shaders.js'

const createThumbnail = (height, canvas) => {
    const thumbnailCanvas = document.createElement("canvas");

    const aspectRatio = canvas.height / canvas.width;

    thumbnailCanvas.width = height / aspectRatio;
    thumbnailCanvas.height = height;
    const tempCtx = thumbnailCanvas.getContext("2d");
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

    return thumbnailCanvas.toDataURL();
}


const ContextWebGL = (canvas, attributes) => {
    console.log("initializing Webgl context ");
    const gl = webgl.initGL(canvas, attributes);

    if (!gl) {
        return null;
    }


    // create shaders
    const vertexShader = webgl.createShader(gl, gl.VERTEX_SHADER, shaders.vertexShader["defaultVertexShader"]);
    const fragmentShader = webgl.createShader(gl, gl.FRAGMENT_SHADER, shaders.fragmentShader["defaultFragmentShader"]);

    const drawImageVertexShader = webgl.createShader(gl, gl.VERTEX_SHADER, shaders.vertexShader["drawImageVertexShader"]);
    const drawImageFragmentShader = webgl.createShader(gl, gl.FRAGMENT_SHADER, shaders.fragmentShader["drawImageFragmentShader"]);

    // setup GLSL program
    const drawRectangleProgram = webgl.createProgram(gl, vertexShader, fragmentShader);

    const drawImageProgram = webgl.createProgram(gl, drawImageVertexShader, drawImageFragmentShader);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(drawRectangleProgram, "a_position");

    // look up uniform locations
    const resolutionUniformLocation = gl.getUniformLocation(drawRectangleProgram, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(drawRectangleProgram, "u_color");

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)

    let currentProgram = drawRectangleProgram;
    gl.useProgram(currentProgram);
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);


    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    //-------------------------------------------------------------------------


    // Fill the buffer with the values that define a rectangle.
    const drawRectangle = (x, y, width, height, color) => {
        const a = (color >> 24) & 0xFF,
            b = (color >> 16) & 0xFF,
            g = (color >> 8) & 0xFF,
            r = color & 0xFF;

        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const x1 = Math.round(x - halfWidth);
        const x2 = Math.round(x + halfWidth);
        const y1 = Math.round(y - halfHeight);
        const y2 = Math.round(y + halfHeight);

        if (currentProgram !== drawRectangleProgram) {
            currentProgram = drawRectangleProgram;
            gl.useProgram(currentProgram);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), gl.STATIC_DRAW);


        gl.uniform4f(colorUniformLocation, r / 255.0, g / 255.0, b / 255.0, a / 255.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);


    }

    const drawLine = (x0, y0, x1, y1, size, color) => {
        let ix = x0 < x1 ? 1 : -1, dx = Math.abs(x1 - x0);
        let iy = y0 < y1 ? 1 : -1, dy = Math.abs(y1 - y0);
        let m = Math.max(dx, dy), cx = m >> 1, cy = m >> 1;
        for (let i = 0; i < m; i++) {
            drawRectangle(x0, y0, size, size, color);
            if ((cx += dx) >= m) { cx -= m; x0 += ix; }
            if ((cy += dy) >= m) { cy -= m; y0 += iy; }
        }
    }

    const drawImage = (img, x, y) => {

        if (currentProgram !== drawImageProgram) {
            currentProgram = drawImageProgram;
            gl.useProgram(currentProgram);
        }

        // look up where the vertex data needs to go.
        const positionLocation = gl.getAttribLocation(drawImageProgram, "a_position");

        // look up uniform locations
        const u_imageLoc = gl.getUniformLocation(drawImageProgram, "u_image");
        const u_matrixLoc = gl.getUniformLocation(drawImageProgram, "u_matrix");

        // provide texture coordinates for the rectangle.
        const positionBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        const dstX = x;
        const dstY = y;
        const dstWidth = img.width;
        const dstHeight = img.height;

        // convert dst pixel coords to clipspace coords      
        const clipX = dstX / gl.canvas.width * 2 - 1;
        const clipY = dstY / gl.canvas.height * -2 + 1;
        const clipWidth = dstWidth / gl.canvas.width * 2;
        const clipHeight = dstHeight / gl.canvas.height * -2;

        // build a matrix that will stretch our
        // unit quad to our desired size and location
        gl.uniformMatrix3fv(u_matrixLoc, false, [
            clipWidth, 0, 0,
            0, clipHeight, 0,
            clipX, clipY, 1,
        ]);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }



    const floodFill = (x, y, replacementColor) => {

        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = gl.canvas.width;
        offscreenCanvas.height = gl.canvas.height;
        const ctx = offscreenCanvas.getContext("2d");
        ctx.drawImage(gl.canvas, 0, 0);
        const imageData = ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        let pixels = new Uint32Array(imageData.data.buffer);
        paint.floodFill(pixels, x, y, replacementColor, offscreenCanvas.width, offscreenCanvas.height);
        drawImage(imageData, 0, 0);
    }


    const clear = () => {
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    const getImageData = () => {
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = gl.canvas.width;
        offscreenCanvas.height = gl.canvas.height;
        const ctx = offscreenCanvas.getContext("2d");
        ctx.drawImage(gl.canvas, 0, 0);
        return ctx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    }


    const getThumbnail = height => createThumbnail(height, canvas);

    return { drawRectangle, drawLine, drawImage, getImageData, floodFill, clear, getThumbnail };
}


const Context2d = (canvas, attributes) => {
    console.log("initializing 2d context ");
    const ctx = canvas.getContext("2d", attributes);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = new Uint32Array(imageData.data.buffer).fill(0);
    let reqID = null;
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    const drawRectangle = (x, y, width, height, color) => {
        let startX = x - Math.floor(width / 2);
        let startY = y - Math.floor(height / 2);
        for (let y = startY; y < startY + width; y++) {
            for (let x = startX; x < startX + height; x++) {
                if (x >= 0 && x < canvasWidth && y >= 0 && y < canvasHeight) pixels[y * canvasWidth + x] = color;
            }
        }

    }


    const drawLine = (x0, y0, x1, y1, size, color) => {
        let ix = x0 < x1 ? 1 : -1, dx = Math.abs(x1 - x0);
        let iy = y0 < y1 ? 1 : -1, dy = Math.abs(y1 - y0);
        let m = Math.max(dx, dy), cx = m >> 1, cy = m >> 1;
        for (let i = 0; i < m; i++) {
            drawRectangle(x0, y0, size, size, color);
            if ((cx += dx) >= m) { cx -= m; x0 += ix; }
            if ((cy += dy) >= m) { cy -= m; y0 += iy; }
        }

    }

    const drawImage = (img, x, y) => {
        ctx.drawImage(img, 0, 0);
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        pixels = new Uint32Array(imageData.data.buffer);
    }

    const update = () => {

        if (ctx) {

            ctx.putImageData(imageData, 0, 0);
            reqID = requestAnimationFrame(update);

        } else {
            cancelAnimationFrame(reqID);
        }
    }


    const clear = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }



    const floodFill = (x, y, replacementColor) => {

        paint.floodFill(pixels, x, y, replacementColor, canvasWidth, canvasHeight);
    }

    const getImageData = () => {
        return ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    }


    const getThumbnail = height => createThumbnail(height, canvas);

    update();



    return { drawRectangle, drawLine, drawImage, getImageData, floodFill, clear, getThumbnail }
}



export { ContextWebGL, Context2d };