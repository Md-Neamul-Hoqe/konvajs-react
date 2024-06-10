import PropTypes from "prop-types";
import { Text } from "react-konva";
import { fontSize, multiplier, radius } from "../utils/constants";

const AxisLabeling = ({ order }) => {
  const labels = Array(order).fill(1);

  return (
    <>
      {/* Height of the poset */}
      {labels.map((_value, height) => (
        <Text
          key={height}
          text={`H${height + 1}`}
          x={(height + 1) * multiplier - radius}
          y={10}
          fontSize={fontSize}
        />
      ))}

      {/* Diameter of the poset */}
      {labels.map((_value, diameter) => (
        <Text
          rotation={90}
          key={diameter}
          text={`W${diameter + 1}`}
          x={20}
          y={(diameter + 1) * multiplier - radius}
          fontSize={fontSize}
        />
      ))}
    </>
  );
};

AxisLabeling.propTypes = {
  order: PropTypes.number,
};

export default AxisLabeling;
