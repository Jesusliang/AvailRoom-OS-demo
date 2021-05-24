import React, { useEffect, useState } from "react";
import styles from "./DraggableComponent.module.scss";
import { AiOutlineMinus, AiOutlineClose } from "react-icons/ai";
import { BiWindows } from "react-icons/bi";

const windowMinHeight = 100;
const windowMinWidth = 100;

const DraggableComponent = ({ children }) => {
  const [isDraggin, setIsDraggin] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [axisOrigin, setAxisOrigin] = useState({
    x: 0,
    y: 0,
  });

  const [axisState, setAxisState] = useState({
    latest: {
      x: 100,
      y: 100,
    },
    elAxis: {
      x: 100,
      y: 100,
    },
  });

  const [resizeState, setResizeState] = useState({
    elSize: {
      width: 600,
      height: 400,
    },
    lastSize: {
      width: 600,
      height: 400,
    },
    type: "",
  });

  const handleDragBegin = (event) => {
    event.preventDefault();
    setIsDraggin(true);
    setAxisOrigin({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleResizeBegin = (event, type) => {
    event.preventDefault();
    setIsResizing(true);
    setAxisOrigin({
      x: event.clientX,
      y: event.clientY,
    });
    setResizeState({ ...resizeState, type });
  };

  useEffect(() => {
    if (!isResizing && !isDraggin) {
      return setIsChanging(false);
    }
    setIsChanging(true);
  }, [isResizing, isDraggin]);

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDraggin(false);
      setAxisState({
        ...axisState,
        latest: {
          x: axisState.elAxis.x,
          y: axisState.elAxis.y,
        },
      });
    };
    const handleDrag = (event) => {
      if (isDraggin) {
        setAxisState({
          ...axisState,
          elAxis: {
            y: axisState.latest.y + (event.clientY - axisOrigin.y),
            x: axisState.latest.x + (event.clientX - axisOrigin.x),
          },
        });
      }
    };
    if (!isDraggin) {
      return;
    }

    window.addEventListener("mouseup", handleDragOver);
    window.addEventListener("mousemove", handleDrag);

    return () => {
      window.removeEventListener("mouseup", handleDragOver);
      window.removeEventListener("mousemove", handleDrag);
    };
  }, [isDraggin, axisState]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeState((resizeState) => ({
        ...resizeState,
        lastSize: {
          height: resizeState.elSize.height,
          width: resizeState.elSize.width,
        },
      }));
      setAxisState({
        ...axisState,
        latest: {
          x: axisState.elAxis.x,
          y: axisState.elAxis.y,
        },
      });
    };

    const handleMouseMove = (event) => {
      if (isResizing) {
        let newWidth;
        let newHeight;
        let newX;
        let newY;
        switch (resizeState.type) {
          case "left":
            newWidth =
              resizeState.lastSize.width + (axisOrigin.x - event.clientX);
            if (newWidth > windowMinWidth) {
              setResizeState({
                ...resizeState,
                elSize: {
                  ...resizeState.elSize,
                  width: newWidth,
                },
              });
              setAxisState({
                ...axisState,
                elAxis: {
                  ...axisState.elAxis,
                  x: axisState.latest.x + (event.clientX - axisOrigin.x),
                },
              });
            }

            break;
          case "right":
            newWidth =
              resizeState.lastSize.width + (event.clientX - axisOrigin.x);
            if (newWidth > windowMinWidth) {
              setResizeState({
                ...resizeState,
                elSize: {
                  ...resizeState.elSize,
                  width: newWidth,
                },
              });
            }
            break;
          case "top":
            newHeight =
              resizeState.lastSize.height + (axisOrigin.y - event.clientY);
            if (newHeight > windowMinHeight) {
              setResizeState((resizeState) => {
                return {
                  ...resizeState,
                  elSize: {
                    ...resizeState.elSize,
                    height: newHeight,
                  },
                };
              });
              setAxisState((axisState) => {
                const newY =
                  axisState.latest.y + (event.clientY - axisOrigin.y);
                return {
                  ...axisState,
                  elAxis: {
                    ...axisState.elAxis,
                    y: newY,
                  },
                };
              });
            }
            break;
          case "bottom":
            newHeight =
              resizeState.lastSize.height + (event.clientY - axisOrigin.y);
            if (newHeight > windowMinHeight) {
              setResizeState((resizeState) => {
                return {
                  ...resizeState,
                  elSize: {
                    ...resizeState.elSize,
                    height: newHeight,
                  },
                };
              });
            }
            break;
          case "topleft":
            newHeight =
              resizeState.lastSize.height + (axisOrigin.y - event.clientY);
            newWidth =
              resizeState.lastSize.width + (axisOrigin.x - event.clientX);
            newX = axisState.latest.x + (event.clientX - axisOrigin.x);
            newY = axisState.latest.y + (event.clientY - axisOrigin.y);
            setResizeState({
              ...resizeState,
              elSize: {
                height:
                  newHeight > windowMinHeight
                    ? newHeight
                    : resizeState.elSize.height,
                width:
                  newWidth > windowMinWidth
                    ? newWidth
                    : resizeState.elSize.width,
              },
            });
            setAxisState({
              ...axisState,
              elAxis: {
                y: newHeight > windowMinHeight ? newY : axisState.elAxis.y,
                x: newWidth > windowMinWidth ? newX : axisState.elAxis.x,
              },
            });
            break;
          case "topright":
            newHeight =
              resizeState.lastSize.height + (axisOrigin.y - event.clientY);
            newWidth =
              resizeState.lastSize.width + (event.clientX - axisOrigin.x);
            newY = axisState.latest.y + (event.clientY - axisOrigin.y);
            setResizeState({
              ...resizeState,
              elSize: {
                height:
                  newHeight > windowMinHeight
                    ? newHeight
                    : resizeState.elSize.height,
                width:
                  newWidth > windowMinWidth
                    ? newWidth
                    : resizeState.elSize.width,
              },
            });
            setAxisState({
              ...axisState,
              elAxis: {
                ...axisState.elAxis,
                y: newHeight > windowMinHeight ? newY : axisState.elAxis.y,
              },
            });
            break;
          case "bottomleft":
            newHeight =
              resizeState.lastSize.height + (event.clientY - axisOrigin.y);
            newWidth =
              resizeState.lastSize.width + (axisOrigin.x - event.clientX);
            newX = axisState.latest.x + (event.clientX - axisOrigin.x);
            setResizeState({
              ...resizeState,
              elSize: {
                height:
                  newHeight > windowMinHeight
                    ? newHeight
                    : resizeState.elSize.height,
                width:
                  newWidth > windowMinWidth
                    ? newWidth
                    : resizeState.elSize.width,
              },
            });
            setAxisState({
              ...axisState,
              elAxis: {
                ...axisState.elAxis,
                x: newWidth > windowMinWidth ? newX : axisState.elAxis.x,
              },
            });
            break;
          case "bottomright":
            newHeight =
              resizeState.lastSize.height + (event.clientY - axisOrigin.y);
            newWidth =
              resizeState.lastSize.width + (event.clientX - axisOrigin.x);
            setResizeState({
              ...resizeState,
              elSize: {
                height:
                  newHeight > windowMinHeight
                    ? newHeight
                    : resizeState.elSize.height,
                width:
                  newWidth > windowMinWidth
                    ? newWidth
                    : resizeState.elSize.width,
              },
            });
            break;
          default:
            break;
        }
      }
    };

    if (!isResizing) {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      return;
    }

    window.addEventListener("mouseup", handleMouseUp);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizeState, axisState]);

  return (
    <div
      style={{
        top: `${axisState.elAxis.y}px`,
        left: `${axisState.elAxis.x}px`,
        width: `${resizeState.elSize.width}px`,
        height: `${resizeState.elSize.height}px`,
      }}
      className={`${styles.draggableComponent} ${
        isChanging && styles.changing
      }`}
    >
      <div onMouseDown={handleDragBegin} className={styles.topBar}>
        <div className={styles.topBar_Btns}>
          <AiOutlineMinus />
        </div>
        <div className={styles.topBar_Btns}>
          <BiWindows />
        </div>
        <div className={styles.topBar_Btns}>
          <AiOutlineClose />
        </div>
      </div>
      <div className={styles.body}>{children}</div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "left");
        }}
        className={`${styles.resizeLeft} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "right");
        }}
        className={`${styles.resizeRight} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "top");
        }}
        className={`${styles.resizeTop} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "bottom");
        }}
        className={`${styles.resizeBottom} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "topleft");
        }}
        className={`${styles.resizeCornerTopLeft} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "topright");
        }}
        className={`${styles.resizeCornerTopRight} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "bottomleft");
        }}
        className={`${styles.resizeCornerBottomLeft} ${styles.resize}`}
      ></div>
      <div
        onMouseDown={(e) => {
          handleResizeBegin(e, "bottomright");
        }}
        className={`${styles.resizeCornerBottomRight} ${styles.resize}`}
      ></div>
    </div>
  );
};

export default DraggableComponent;
