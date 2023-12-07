import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { Write, day, regex, removeMarkdown } from 'utils';
import { EllipsisTypography } from './EllipsisTypography';
import { EllipsisMultilineTypography } from './EllipsisMultilineTypography';

interface WriteListCardProps {
  write: Write;
}

export function WriteListCard({ write }: WriteListCardProps) {
  const markdownPreviewContent = regex.getWriteDescription(removeMarkdown(write.content));

  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea>
        {write.imgUrl ? (
          <CardMedia alt={write.title} component="img" height={170} image={write.imgUrl} />
        ) : (
          <Stack height={170} />
        )}
        <CardContent>
          <EllipsisTypography fontSize={18} gutterBottom>
            {write.title}
          </EllipsisTypography>
          <Stack width="100%">
            <EllipsisMultilineTypography color="text.secondary" ellipsisLine={4} variant="body2">
              {markdownPreviewContent}
            </EllipsisMultilineTypography>
          </Stack>
          <Stack alignItems="center" direction="row" gap={2} justifyContent="space-between" mt={2}>
            {!write.isPublish && (
              <Typography color={(theme) => theme.palette.grey[500]} fontSize={15}>
                비공개글
              </Typography>
            )}
            <Typography fontSize={15} textAlign="end">
              {day(write.createdAt).defaultFormat()}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
