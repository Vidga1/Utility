import React from "react";

export const getDefaultProps = <T>(
  component: React.ComponentType<T>,
): Partial<T> | undefined => component.defaultProps;
