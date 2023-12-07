import { Typography, TypographyProps } from '@mui/material';
import React from 'react';

interface EllipsisMultilineTypographyProps extends TypographyProps {
  ellipsisLine?: number;
}

export function EllipsisMultilineTypography({
  ellipsisLine = 4,
  ...props
}: EllipsisMultilineTypographyProps) {
  return (
    <Typography
      sx={{
        width: '100%',
        wordBreak: 'break-all',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: ellipsisLine,
        overflowWrap: 'break-all',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }}
      {...props}
    />
  );
}
