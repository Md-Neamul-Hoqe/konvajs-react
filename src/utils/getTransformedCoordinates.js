export default function getTransformedCoordinates(x, y, canvasDimension) {
    // Translate mouse coordinates to canvas coordinates
    const canvasX = x;
    const canvasY = y - canvasDimension;

    // Apply the inverse rotation
    const transformedX = canvasY;
    const transformedY = -canvasX;

    return { x: -Math.round(transformedX), y: -Math.round(transformedY) };
}