export type AnimationMetaType = {
  loop: boolean;
  x: number;
  y: number;
  hideLoop: boolean;
};

export type FrameType = {
  frame: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  sourceSize: {
    w: number;
    h: number;
  };
};
