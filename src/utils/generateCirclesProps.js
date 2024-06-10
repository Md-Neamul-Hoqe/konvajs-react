import { multiplier, radius } from "./constants";

export default function generateCirclesProps(order) {
    const circlesProps = [];

    for (let row = 0; row < order; row++) {
        for (let col = 0; col < order; col++) {
            const x = (col + 1) * multiplier, y = (row + 1) * multiplier;

            circlesProps.push({
                x,
                y,
                radius,
                fill: "white",
                stroke: "black",
                id: `el_${col}_${row}`,
                covers: []
            })
        }
    }

    // console.log(circlesProps);
    return circlesProps
}