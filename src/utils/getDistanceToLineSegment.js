export default function getDistanceToLineSegment(px, py, x1, y1, x2, y2) {
    // const [ px, py ] = rotatePoint(x, y, -90)
    // Calculate the squared length of the segment
    const segLengthSq = sqDistance(x1, y1, x2, y2);

    if (segLengthSq === 0) {
        // If the segment length is zero, (x1, y1) and (x2, y2) are the same point
        return Math.sqrt(sqDistance(px, py, x1, y1));
    }

    // Projection factor (t) of point (px, y) on the infinite line through (x1, y1) and (x2, y2)
    const t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / segLengthSq;

    // Clamp t to the range [0, 1] to ensure the projection falls within the segment
    const clampedT = Math.max(0, Math.min(1, t));

    // Calculate the projection point on the segment
    const projX = x1 + clampedT * (x2 - x1);
    const projY = y1 + clampedT * (y2 - y1);

    // Return the distance from the point to the projection on the segment
    // console.log(Math.sqrt(sqDistance(px, py, projX, projY)));
    return Math.sqrt(sqDistance(px, py, projX, projY));
}

// Function to calculate the squared distance between two points
function sqDistance(xa, ya, xb, yb) {
    return (xa - xb) ** 2 + (ya - yb) ** 2;
}


