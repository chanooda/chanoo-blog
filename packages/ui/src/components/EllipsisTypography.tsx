import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

type EllipsisTypographyProps = TypographyProps;

export function EllipsisTypography({ ...props }: EllipsisTypographyProps) {
  return (
    <Typography
      overflow="hidden"
      textOverflow="ellipsis"
      variant="body1"
      whiteSpace="nowrap"
      width="100%"
      {...props}
    />
  );
}
