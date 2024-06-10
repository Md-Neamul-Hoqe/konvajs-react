import { multiplier } from "./constants";

/**
 * get x and y - the center of the circle based on the given id of the circle
 * @param {String} id id of the circle
 * @returns Object.x, Object.y
 */
export default function getCoords(id) {
    console.log(id);
    const indices = id.split('_')

    const x = (parseInt(indices[ 1 ]) + 1) * multiplier, y = (parseInt(indices[ 2 ]) + 1) * multiplier;
    return { x, y }
}