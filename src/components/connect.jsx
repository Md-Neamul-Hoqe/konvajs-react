import { Line } from "react-konva";
import PropTypes from "prop-types";

/**
 * connect the element [xStart, yStart] with it's cover or possible cover [xEnd, yEnd]
 * handle hover effect by dashApart [= 0 to connect, = 5 to hover]
 * */
const Connect = ({
  xStart = 0,
  yStart = 0,
  xEnd = 0,
  yEnd = 0,
  dashApart = 0,
}) => {
  console.log("Connected {%d, %d} with {%d, %d}", xStart, yStart, xEnd, yEnd);
  return (
    <Line
      points={[xStart, yStart, xEnd, yEnd]}
      dash={[5, dashApart]}
      stroke="black"
    />
  );
};

Connect.propTypes = {
  xStart: PropTypes.number,
  yStart: PropTypes.number,
  xEnd: PropTypes.number,
  yEnd: PropTypes.number,
  dashApart: PropTypes.number,
};

export default Connect;
