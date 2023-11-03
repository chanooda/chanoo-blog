'use client';

import { MarkdownPreview } from 'markdown';
import React from 'react';
import { WriteRes } from 'utils';

interface PostDetailProps {
  write: WriteRes;
}

export function PostDetail({ write }: PostDetailProps) {
  return (
    <MarkdownPreview
      write={{
        createdAt: write.createdAt,
        mainImage: write.imgUrl,
        series: write.series.name,
        tag: write.tags?.map((writeTag) => writeTag.tag.name),
        title: write.title
      }}
    >
      {write.content}
    </MarkdownPreview>
  );
}
