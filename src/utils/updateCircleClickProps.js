export default function updateCircleClickProps(grid, id = null) {
    /* fill the circle of `id` if already filled or unfilled now */
    return grid.map((circles, row) =>
        circles.map((circle, col) => ({
            fill: id === `el_${row}_${col}` ? circle?.fill === "white" ? "black" : "white" : circle.fill,
            ...circle,
        }))
    );
}