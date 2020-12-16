
const plotLine = (pixels, x0, y0, x1, y1, color, size, width, height) => {
    let ix = x0 < x1 ? 1 : -1, dx = Math.abs(x1 - x0);
    let iy = y0 < y1 ? 1 : -1, dy = Math.abs(y1 - y0);
    let m = Math.max(dx, dy), cx = m >> 1, cy = m >> 1;
    for (let i = 0; i < m; i++) {
        plotPixels(pixels, x0, y0, size, color, width, height);
        if ((cx += dx) >= m) { cx -= m; x0 += ix; }
        if ((cy += dy) >= m) { cy -= m; y0 += iy; }
    }
}



const plotPixels = (pixels, cx, cy, size, color, width, height) => {
    let startX = cx - Math.floor(size / 2);
    let startY = cy - Math.floor(size / 2);
    for (let y = startY; y < startY + size; y++) {
        for (let x = startX; x < startX + size; x++) {
            if (x >= 0 && x < width && y >= 0 && y < height) pixels[y * width + x] = color;
        }
    }
}

const setPixel = (pixels, x, y, color, width) => {
    let oldpixel = { x: x, y: y, color: pixels[y * width + x] };
    // plot pixel
    pixels[y * width + x] = color;
    return oldpixel;
}

const getPixel = (pixels, x, y, width) => {
    /*   x = Math.min(Math.max(x, 0), width);
      y = Math.min(Math.max(y, 0), height); */
    return pixels[y * width + x];
}




const floodFill = (pixels, x, y, replacementColor, width, height) => {
    const targetColor = pixels[y * width + x];
    const oldpixels = pixels.slice();
    if (targetColor === replacementColor) return;

    let x1;
    let spanAbove, spanBelow;

    const stack = [];

    stack.push({ x: x, y: y });
    while (stack.length > 0) {
        const { x, y } = stack.pop();

        x1 = x;
        while (x1 >= 0 && pixels[y * width + x1] === targetColor) x1--;
        x1++;
        spanAbove = spanBelow = 0;
        while (x1 < width && pixels[y * width + x1] === targetColor) {
            pixels[y * width + x1] = replacementColor;
            if (!spanAbove && y > 0 && pixels[(y - 1) * width + x1] === targetColor) {
                stack.push({ x: x1, y: y - 1 });
                spanAbove = 1;
            }
            else if (spanAbove && y > 0 && pixels[(y - 1) * width + x1] !== targetColor) {
                spanAbove = 0;
            }
            if (!spanBelow && y < height - 1 && pixels[(y + 1) * width + x1] === targetColor) {
                stack.push({ x: x1, y: y + 1 });
                spanBelow = 1;
            }
            else if (spanBelow && y < height - 1 && pixels[(y + 1) * width + x1] !== targetColor) {
                spanBelow = 0;
            }
            x1++;
        }
    }

    return oldpixels;
}

const plotCircle = (pixels, x0, y0, r, color) => {
    let x = r;
    let y = 0;
    let err = 1 - x;

    while (x >= y) {
        plotLine(pixels, x + x0, y + y0, x + x0, -y + y0, color, 1);
        plotLine(pixels, y + x0, x + y0, y + x0, -x + y0, color, 1);
        plotLine(pixels, -x + x0, y + y0, -x + x0, -y + y0, color, 1);
        plotLine(pixels, -y + x0, x + y0, -y + x0, -x + y0, color, 1);
        y++;

        if (err < 0)
            err = err + 2 * y + 1;
        else {
            x--;
            err += 2 * (y - x + 1);
        }

    }


}



const drawLine = (ctx, x1, y1, x2, y2, color, size) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 0.5);
    ctx.lineTo(x2, y2 + 0.5);
    ctx.stroke();
    ctx.restore();
}

export { setPixel, getPixel, plotLine, plotPixels, plotCircle, floodFill, drawLine }