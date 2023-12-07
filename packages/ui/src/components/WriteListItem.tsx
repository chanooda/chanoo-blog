import { Box, Stack, Typography } from '@mui/material';
import { Write, day, regex, removeMarkdown } from 'utils';
import { EllipsisMultilineTypography } from './EllipsisMultilineTypography';
import { EllipsisTypography } from './EllipsisTypography';

interface WriteListItemProps {
  write: Write;
}

export function WriteListItem({ write }: WriteListItemProps) {
  const markdownPreviewContent = regex.getWriteDescription(removeMarkdown(write.content));

  return (
    <Stack direction="row" gap={2} height="max-content">
      {write.imgUrl ? (
        <Box
          alt={write.title}
          component="img"
          minWidth="35%"
          src={write.imgUrl}
          sx={{ aspectRatio: '16/9 auto', objectFit: 'cover' }}
          width="35%"
        />
      ) : (
        <Stack minWidth="35%" width="35%" />
      )}
      <Stack width="100%">
        <EllipsisTypography fontSize={20} fontWeight={700} gutterBottom>
          {write.title}
        </EllipsisTypography>
        <EllipsisMultilineTypography color="text.secondary" ellipsisLine={6} variant="body2">
          {markdownPreviewContent}
        </EllipsisMultilineTypography>
        <Typography fontSize={14} mt={1} textAlign="end">
          {day(write.createdAt).defaultFormat()}
        </Typography>
      </Stack>
    </Stack>
  );
}
