import { removeMarkdown } from 'markdown';
import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  EllipsisMultilineTypography,
  EllipsisTypography,
  Link,
  Stack,
  Typography
} from 'ui';
import { WriteRes, day, regex } from 'utils';

interface WriteListCardProps {
  write?: WriteRes;
}

export function WriteListCard({ write }: WriteListCardProps) {
  const markdownPreviewContent = regex.getWriteDescription(removeMarkdown(write.content));

  return (
    <Link href={`/post/${write.id}`}>
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
            <Typography fontSize={15} mt={2} textAlign="end">
              {day(write.createdAt).defaultFormat()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
