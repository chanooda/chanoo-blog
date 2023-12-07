/* eslint-disable react/function-component-definition */
import { ReactMarkdown, ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Chip, Stack, Typography } from 'ui';
import { WriteRes, day } from 'utils';
import { A, Blockquote, Code, Img } from './MarkdownComponents';

export interface MarkdownProps extends Omit<ReactMarkdownOptions, 'children'> {
  write: WriteRes;
}

export function Markdown({ write }: MarkdownProps) {
  return (
    <Box fontFamily="inherit" height="100%" mx="auto" px={2} py={4} width="100%">
      <Stack direction="column" width="100%">
        <Box component="h1" my={0}>
          {write?.title}
        </Box>
        <Stack direction="row" mt={1}>
          <Typography fontWeight={600}>김찬우</Typography> ・
          <Typography color="grey.700">{day(write?.createdAt).format('YYYY-MM-DD')}</Typography>
        </Stack>
        {write?.tags?.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={2} mt={2} width="100%">
            {write?.tags?.map((writeTag) => (
              <Chip key={writeTag.tag.id} label={writeTag.tag.name} />
            ))}
          </Stack>
        )}
        {write.series && (
          <Stack bgcolor="grey.200" borderRadius={2} height={100} mt={2} p={2} width="100%">
            <Typography variant="h6">{write.series.name}</Typography>
          </Stack>
        )}
        {write.imgUrl && (
          <Box mt={2} width="100%">
            <Box
              alt="메인 이미지"
              component="img"
              src={write.imgUrl}
              sx={{ objectFit: 'cover', aspectRatio: 16 / 9 }}
              width="100%"
            />
          </Box>
        )}
      </Stack>
      <ReactMarkdown
        linkTarget="_blank"
        remarkPlugins={[remarkGfm]}
        components={{
          code: Code,
          img: Img,
          a: A,
          blockquote: Blockquote
        }}
      >
        {write.content}
      </ReactMarkdown>
    </Box>
  );
}
