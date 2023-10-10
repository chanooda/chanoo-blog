import React from 'react';
import { GlobalError } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Stack } from 'ui';
import { useChanooQuery } from '../../libs/queryHook';
import { WriteRes } from '../../types/res';
import { MdPreview, MdPreviewProps } from '../../components/markdown/MdPreview';

export function PostDetail() {
  const { id } = useParams();
  const { data: write } = useChanooQuery<WriteRes, GlobalError>([`/write/${id}`], {
    enabled: !!id,
    useErrorBoundary: true
  });

  const wrtieInfo: MdPreviewProps['write'] = {
    mainImage: write?.data?.data?.imgUrl,
    series: write?.data?.data?.series?.name,
    tag: write?.data?.data?.tags?.map((tag) => tag.tag.name),
    title: write?.data?.data?.title,
    createdAt: write?.data?.data?.createdAt
  };
  return (
    <Stack>
      <MdPreview id={id} write={wrtieInfo}>
        {write?.data?.data?.content || ''}
      </MdPreview>
    </Stack>
  );
}
