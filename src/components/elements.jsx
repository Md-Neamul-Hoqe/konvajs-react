import PropTypes from "prop-types";
import { Circle, Text } from "react-konva";
import { multiplier, radius } from "../utils/constants";

const Elements = ({
  order = 5,
  handleClick,
  handleHover,
  grid = [],
}) => {
  return (
    <>
      {grid?.length ? (
        grid.map((circle) => (
          <Circle
            key={circle?.id}
            x={circle.x}
            y={circle.y}
            id={circle?.id}
            radius={radius}
            fill={circle?.fill}
            covers={circle?.covers}
            stroke="black"
            onPointerEnter={handleHover}
            onPointerOut={handleHover}
            onClick={handleClick}
          />
        ))
      ) : (
        <Text
          rotation={90}
          text="Loading..."
          x={((order + 1) * multiplier) / 2 + 12}
          y={((order + 1) * multiplier) / 2 - 50}
          fontSize={24}
        />
      )}
    </>
  );
};

Elements.propTypes = {
  order: PropTypes.number,
  grid: PropTypes.array,
  setGrid: PropTypes.func,
  handleClick: PropTypes.func,
  handleHoverOut: PropTypes.func,
  handleHover: PropTypes.func,
};

export default Elements;
