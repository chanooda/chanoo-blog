import React, { useState } from 'react';
import { GlobalError } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { Stack, Typography } from 'ui';
import { Markdown } from 'markdown';
import { WriteRes } from 'utils';
import { useChanooQuery } from '../../libs/queryHook';
import { WriteDeleteModal } from '../../components/modal/WriteDeleteModal';

export function PostDetail() {
  const { id } = useParams();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const { data: write } = useChanooQuery<WriteRes, GlobalError>([`/write/${id}`], {
    enabled: !!id,
    useErrorBoundary: true
  });

  const clickDeleteHandler = () => {
    setIsShowDeleteModal(true);
  };

  return (
    <Stack maxWidth={800} mx="auto">
      <Stack direction="row" gap={1} justifyContent="end" mt={4} mx="auto" px={2} width="100%">
        <Link to={`/post/${id}/edit`}>
          <Typography sx={{ textDecoration: 'underline' }}>수정</Typography>
        </Link>
        <Typography
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={clickDeleteHandler}
        >
          삭제
        </Typography>
      </Stack>
      {write && <Markdown write={write.data.data} />}
      {id && isShowDeleteModal && (
        <WriteDeleteModal
          id={id}
          open={isShowDeleteModal}
          title={write?.data.data.title || ''}
          onClose={() => setIsShowDeleteModal(false)}
        />
      )}
    </Stack>
  );
}
