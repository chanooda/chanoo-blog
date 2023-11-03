/* eslint-disable react/function-component-definition */
import { ReactMarkdown, ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Chip, Stack, Typography } from 'ui';
import { day } from 'utils';
import { A, Blockquote, Code, Img } from './MarkdownComponents';

interface MarkdownPreviewWrite {
  createdAt?: string;
  isPublish?: boolean;
  mainImage?: string;
  series?: string;
  tag?: string[];
  title?: string;
}

export interface MdPreviewProps extends ReactMarkdownOptions {
  write: MarkdownPreviewWrite;
}

export function MarkdownPreview({ children, write }: MdPreviewProps) {
  return (
    <Box fontFamily="inherit" height="100%" maxWidth={800} mx="auto" px={2} py={4} width="100%">
      <Stack direction="column" width="100%">
        <Box component="h1" my={0}>
          {write?.title}
        </Box>
        {write?.createdAt && (
          <Stack direction="row" mt={1}>
            <Typography fontWeight={600}>김찬우</Typography> ・
            <Typography color="grey.700">{day(write?.createdAt).format('YYYY-MM-DD')}</Typography>
          </Stack>
        )}
        {write?.tag && (
          <Stack direction="row" flexWrap="wrap" gap={2} mt={2} width="100%">
            {write?.tag?.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </Stack>
        )}
        {write?.series && (
          <Stack bgcolor="grey.200" borderRadius={2} height={100} mt={2} p={2} width="100%">
            <Typography variant="h6">{write?.series}</Typography>
          </Stack>
        )}
        {write?.mainImage && (
          <Box mt={2} width="100%">
            <Box
              alt="메인 이미지"
              component="img"
              src={write?.mainImage}
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
        {children}
      </ReactMarkdown>
    </Box>
  );
}
