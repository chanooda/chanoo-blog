import { useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, ModalProps, Stack, Typography, useSnackbar } from 'ui';
import { GlobalError } from 'utils';
import { useChanooMutation } from '../../libs/queryHook';
import { ModalContent } from './ModalContent';

interface WriteDeleteModalProps extends Omit<ModalProps, 'children'> {
  id: string;
  title: string;
}

export function WriteDeleteModal({ id, title, ...modalProps }: WriteDeleteModalProps) {
  const navigate = useNavigate();
  const [enteredTitle, setEnteredTitle] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { invalidateQueries } = useQueryClient();

  const { mutate } = useChanooMutation<undefined, GlobalError>(
    ['DELETE', `write/${id}`, undefined],
    {
      onSuccess() {
        // invalidateQueries(['/write']);
        enqueueSnackbar({
          variant: 'success',
          message: '삭제되었습니다.'
        });
        navigate('/post');
      }
    }
  );

  const changeEnteredTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setEnteredTitle(e.target.value);
  };

  const clickDeleteButtonHandler = () => {
    if (title !== enteredTitle) {
      enqueueSnackbar({
        variant: 'error',
        message: '제목과 입력이 같지 않습니다.'
      });
      return;
    }
    mutate();
  };

  return (
    <Modal {...modalProps}>
      <ModalContent>
        <Typography variant="h6">정말 글을 삭제하시겠습니까?</Typography>
        <Typography variant="body2">
          <b>{title}</b> 을 삭제하기 위해서 아래에 <b>글의 제목</b>을 입력해주세요.
        </Typography>
        <Stack gap={2} mt={1}>
          <Input placeholder="글 제목" onChange={changeEnteredTitle} />
          <Button color="error" variant="contained" onClick={clickDeleteButtonHandler}>
            글 삭제
          </Button>
        </Stack>
      </ModalContent>
    </Modal>
  );
}
