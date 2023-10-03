import React from 'react';
import { Link } from 'react-router-dom';
import { Box, EllipsisMultilineTypography, EllipsisTypography, Stack, Typography } from 'ui';
import removeMarkdown from 'markdown-to-text';
import { day, regex } from 'utils';
import { WriteRes } from '../../types/res';

interface WriteListItemProps {
  write: WriteRes;
}
export function WriteListItem({ write }: WriteListItemProps) {
  console.log(removeMarkdown(write.content));
  console.log(write.content);
  return (
    <Link style={{ width: '100%' }} to={`/post/${write.id}`}>
      <Stack direction="row" gap={2} height={200} width="100%">
        {write?.imgUrl && (
          <Box height="100%" sx={{ aspectRatio: 16 / 9 }}>
            <Box
              alt={`${write.title} 사진`}
              component="img"
              height="100%"
              src={write?.imgUrl}
              width="100%"
            />
          </Box>
        )}
        <Stack gap={1} height="100%" width="100%">
          <EllipsisTypography variant="h6">{write?.title}</EllipsisTypography>
          <EllipsisMultilineTypography ellipsisLine={5}>
            {regex.getWriteDescription(removeMarkdown(write.content))}
          </EllipsisMultilineTypography>
          <Stack
            alignItems="center"
            direction="row"
            gap={1}
            justifyContent="space-between"
            mt="auto"
            width="100%"
          >
            <Stack direction="row">
              {!write.isPublish && (
                <Typography color="primary.main" fontWeight={600} variant="body1">
                  비공개
                </Typography>
              )}
            </Stack>
            <Stack direction="row" gap={1}>
              <Typography variant="body2">
                <b>생성일</b> {` : ${day(write.createdAt).defaultFormat()}`}
              </Typography>
              <Typography variant="body2">
                <b>수정일</b> {` : ${day(write.updatedAt).defaultFormat()}`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Link>
  );
}
