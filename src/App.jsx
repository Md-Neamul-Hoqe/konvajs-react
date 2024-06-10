import { Layer, Rect, Stage } from "react-konva";
import { dashApart, multiplier, strokeWidth } from "./utils/constants";
import AxisLabeling from "./components/axisLabeling";
import Elements from "./components/elements";
import { useEffect, useRef, useState } from "react";
import generateCirclesProps from "./utils/generateCirclesProps";
import Connect from "./components/connect";
import getCoords from "./utils/getCoords";
import getDistanceToLineSegment from "./utils/getDistanceToLineSegment";
import getTransformedCoordinates from "./utils/getTransformedCoordinates";

const order = 3;
/**
 * TODO:
 * 1. click to select a circle as element or deselect it if already selected
 * 2. SHIFT + click to select a selected circle or firstly set as selected if not already selected and then select as first end point of connector then SHIFT + another circle to connect them or disconnect them if already connected
 * 3.
 */
/**
 * Errors:
 * 1. Text components are not supported for now in ReactKonva. Your text is: "0"
 * => don't use `&&` for conditional rendering use `? ... :` instead.
 */
let hoverConnected = false;

function App() {
  const stageRef = useRef(null);
  const [connectors, setConnectors] = useState(null);
  const [hovers, setHovers] = useState([null, null]);
  const [propsGrid, setPropsGrid] = useState([]);

  // const [selectedElements, setSelectedElements] = useState([]);
  /* constants */
  const canvasDimension = (order + 1) * multiplier;

  /* states */

  useEffect(() => {
    setPropsGrid(generateCirclesProps(order));
  }, []);

  // useEffect(() => {
  //   const subscribe = async () => {
  //     // console.log(stageRef?.current);

  //     /* rotate all shapes and swap {x, y} */
  //     if (stageRef?.current) {
  //       const layers = await stageRef.current.getChildren();

  //       if (layers?.length) {
  //         const circles = await layers?.[1].getChildren();

  //         console.log(layers);
  //         layers.forEach((child) => {
  //           // console.log(child.getX());
  //           const tempX = child.getX();
  //           child.setX(child.getY());
  //           child.setY(tempX + canvasDimension);
  //           child.rotation(-90);
  //         });

  //         stageRef.current.batchDraw();
  //       } else {
  //         console.log("no layers found.");
  //       }
  //     }
  //   };

  //   return () => {
  //     return subscribe();
  //   };
  // });
  // console.log("Connectors: ", connectors?.element1);
  /**
   * Check is SHIFT key pressed
   * if doesn't pressed then select / deselect the element
   * if pressed then
   *  check is selected or not
   *  if hasn't selected yet, then select it and [connectors?.element1 === null] set to connectors.element1 or element2
   *  if already selected, then set to connectors
   */
  const handleClick = async (e) => {
    /* get the element */
    const circleShape = e.target;

    /* get current selection status */
    const oldStatus = circleShape.fill();

    /* get stage of the element */
    // const stage = await circleShape.getStage();
    // const element1 = await stage.pointerClickStartShape;
    // const element2 = await stage.pointerClickEndShape;

    /* get all events attached to this element */
    const eventOnTheCircle = await e.evt;

    // console.log(selectedELs);
    /* update connectors state */

    // console.log("Clicked element: ", e.type);
    // console.log("Clicked element: ", eventOnTheCircle.shiftKey, e.evt);
    // console.log("Clicked element: ", circleShape.shiftKey);
    // console.log("Clicked stage: ", e.currentTarget);

    if (eventOnTheCircle.shiftKey) {
      /* position of the element */
      const { x, y } = circleShape.position();

      /* selected if hasn't already selected. */
      if (circleShape.fill() !== "black") {
        circleShape.fill("black"); // set selected for use instantly in this function
      }

      /* get the properties of the element */
      const newProps = {
        ...circleShape.getAttrs(),
      };

      // console.log("connectors: ", connectors?.id());
      if (connectors) {
        const { x: xCover } = connectors.position();

        if (x < xCover) {
          /* update covers of the element on the connector */
          newProps.covers.includes(connectors.id())
            ? newProps.covers.splice(
                newProps.covers.indexOf(connectors.id()),
                1
              )
            : newProps.covers.push(connectors.id());
        } else {
          /* element is the cover of the connector */

          /* get props of the element in the connector */
          const [connectorProps] = propsGrid.filter(
            (circleProps) => circleProps.id === connectors.id()
          );

          /* update covers of the element on the connector */
          connectorProps.covers.includes(circleShape.id())
            ? connectorProps.covers.splice(
                connectorProps.covers.indexOf(circleShape.id()),
                1
              )
            : connectorProps.covers.push(circleShape.id());
        }

        /* clear local state after making connection  */
        setConnectors(null);
      } else {
        setConnectors(circleShape);
      }

      /* set others as usual */
      const restProps = propsGrid.filter(
        (circleProps) => circleProps.x !== x || circleProps.y !== y
      );

      // const newPropsGrid = [connectors?.getAttrs(), newProps, ...restProps];
      // console.log(restProps[0]);

      /* TODO: update grid with connectors info */

      /* update grid properties */
      const updatedPropsGrid = [newProps, ...restProps];
      // console.log("new props: ", updatedPropsGrid);
      setPropsGrid(updatedPropsGrid);
      // console.log(
      //   "Prev-Connectors ",
      //   Object.values(connectors).filter((value) => value)
      // );
      // element1.lineCap("round");
      // /* Draw a line from `element1` to `element2` */

      /* update connectors in state if it is the first element */
    } else {
      /* If shift key doesn't pressed then select or deselect the element */

      /* get layer on which this element drawn */
      const layer = circleShape.getLayer();

      /* get all elements on this layer */
      const circles = layer.find("Circle");

      /* get all selected elements */
      const selectedELs = circles.filter((circle) => circle.fill() === "black");
      let updatedSEs = [];

      if (oldStatus === "black") {
        updatedSEs = selectedELs.map((element) => {
          if (element?.covers && element?.covers?.includes(circleShape.id()))
            element.covers.splice(element.covers.indexOf(connectors.id()), 1);
          return element;
        });
      }
      /* find the position of the current shape */
      console.log(circleShape.position());

      /* fill / unfill */
      const fillProps = {
        ...circleShape.getAttrs(),
        fill: oldStatus === "black" ? "white" : "black",
      };

      const newProps = [fillProps, ...updatedSEs];
      const ids = new Set(newProps.map((circleProps) => circleProps.id));

      /* set others as usual */
      let updatedProps = propsGrid.filter(
        (circleProps) => !ids.has(circleProps.id)
      );

      /* update grid properties */
      setPropsGrid([...newProps, ...updatedProps]);
    }
  };

  /* on hover set cursor to pointer and do shape scaled */
  const handleHoverOnElement = (e) => {
    const circle = e.target;
    const circleContainer = circle.getStage().container();
    console.log(circle);
    switch (e.type) {
      case "pointerenter":
        circle.scale({ x: 1.2, y: 1.2 });
        circleContainer.style.cursor = "pointer";
        break;

      default:
        circle.scale({ x: 1, y: 1 });
        circleContainer.style.cursor = "default";
        break;
    }
  };

  const handleHoverOnLayer = (e) => {
    const stage = e.target.getStage();
    const circleContainer = stage.container();

    // Get all black-filled circles on the stage
    const circles = stage
      .find("Circle")
      .filter((child) => child.fill() === "black");

    if (circles.length > 1) {
      const { x, y } = stage.getPointerPosition();
      const { x: modifiedX, y: modifiedY } = getTransformedCoordinates(
        x,
        y,
        canvasDimension
      );

      let closestPoint1 = null;
      let closestPoint2 = null;
      let minLength = Infinity;

      // Loop through each pair of circles
      for (let i = 0; i < circles.length; i++) {
        const center1 = circles[i].position();

        for (let j = i + 1; j < circles.length; j++) {
          const center2 = circles[j].position();
          const distance = getDistanceToLineSegment(
            modifiedX,
            modifiedY,
            center1.x,
            center1.y,
            center2.x,
            center2.y
          );
          const length = Math.hypot(
            center2.x - center1.x,
            center2.y - center1.y
          );

          // Check if the point lies on the line segment and if the segment is the shortest so far
          if (distance < 5 && length < minLength) {
            minLength = length;
            closestPoint1 = center1;
            closestPoint2 = center2;
          }
        }
      }

      // Update visuals (optional)
      if (closestPoint1 && closestPoint2) {
        console.log("Closest circles:", closestPoint1, closestPoint2);
        hoverConnected = true;
        circleContainer.style.cursor = "pointer"; // Changed line: set cursor to pointer when connected
        setHovers([closestPoint1, closestPoint2]);
      } else if (hoverConnected) {
        circleContainer.style.cursor = "default"; // Changed line: set cursor to default when not connected
        hoverConnected = false;
        setHovers([null, null]);
      }
    } else if (hoverConnected) {
      hoverConnected = false;
      setHovers([null, null]);
    }
  };

  // Helper function to calculate the distance from a point to a line segment

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl text-center font-extrabold mt-3 underline underline-offset-4 decoration-double">
        Konva React
      </h1>

      <section className="mt-10 border p-16 pt-10 bg-green-50 text-center">
        <h3 className="text-base font-mono underline underline-offset-4 decoration-dashed decoration-from-font mb-6">
          Poset of order {order}
        </h3>
        <div>
          <Stage
            ref={stageRef}
            rotation={-90}
            x={0}
            y={canvasDimension}
            // y={0}
            width={canvasDimension}
            height={canvasDimension}
            onPointerMove={handleHoverOnLayer}>
            {/* frame and labeling */}
            <Layer name="frame">
              <AxisLabeling order={order} />
              <Rect
                x={multiplier / 2}
                y={multiplier / 2}
                width={canvasDimension - multiplier}
                height={canvasDimension - multiplier}
                fill="white"
                stroke="black"
                strokeWidth={strokeWidth}
                opacity={0.2}
              />
            </Layer>

            {/* grid points */}
            <Layer name="elements">
              <Elements
                grid={propsGrid}
                handleHover={handleHoverOnElement}
                handleClick={handleClick}
                order={order}
              />

              {/* connections */}
              {propsGrid
                .filter((circleProps) => circleProps.covers?.length > 0)
                .map((circleProps) => {
                  const { x, y, covers } = circleProps;

                  return covers.map((cover, idx) => {
                    const { x: xEnd, y: yEnd } = getCoords(cover);

                    console.log(x, y, xEnd, yEnd);
                    return (
                      <Connect
                        key={idx}
                        xStart={x}
                        yStart={y}
                        xEnd={xEnd}
                        yEnd={yEnd}
                        dashApart={0}
                      />
                    );
                  });
                })}

              {/* hover effect */}
              {hovers?.[0]?.x ? (
                <Connect
                  xStart={hovers?.[0]?.x}
                  yStart={hovers?.[0]?.y}
                  xEnd={hovers?.[1]?.x}
                  yEnd={hovers?.[1]?.y}
                  dashApart={dashApart}
                />
              ) : null}
            </Layer>
          </Stage>
        </div>
      </section>
    </main>
  );
}

export default App;
