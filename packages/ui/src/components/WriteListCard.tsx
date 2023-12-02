import { Card, CardActionArea, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { WriteRes, day, regex, removeMarkdown } from 'utils';
import { EllipsisTypography } from './EllipsisTypography';
import { EllipsisMultilineTypography } from './EllipsisMultilineTypography';

interface WriteListCardProps {
  write: WriteRes;
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
          <Stack height={75} width="100%">
            <EllipsisMultilineTypography color="text.secondary" ellipsisLine={4} variant="body2">
              {markdownPreviewContent}
            </EllipsisMultilineTypography>
          </Stack>
          <Stack alignItems="center" direction="row" justifyContent="space-between">
            {!write.isPublish && (
              <Typography color={(theme) => theme.palette.grey[500]} fontSize={15} mt={2}>
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
