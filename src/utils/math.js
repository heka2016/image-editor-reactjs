const lerp = (v1, v2, t) => {
    return (1 - t) * v1 + t * v2;
}

const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max)
}

export { lerp , clamp }