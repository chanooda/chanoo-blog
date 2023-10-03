import React, { ChangeEvent, useState } from 'react';
import { Button, Input, Modal, ModalProps } from 'ui';
import { ModalContent } from './ModalContent';

interface WriteEmbedAddModalProps extends Omit<ModalProps, 'children'> {
  getEmbedUrl: (url: string) => void;
}

export function WriteEmbedAddModal({ getEmbedUrl, ...props }: WriteEmbedAddModalProps) {
  const [embedUrl, setEmbedUrl] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmbedUrl(e.target.value);
  };

  const submitHandler = () => {
    if (embedUrl) getEmbedUrl(embedUrl);
  };

  return (
    <Modal {...props}>
      <ModalContent sx={{ width: 'calc(100% - 40px)', maxWidth: 500 }}>
        <Input placeholder="url을 입력해주세요." type="text" onChange={onChange} />
        <Button fullWidth sx={{ mt: 2 }} onClick={submitHandler}>
          확인
        </Button>
      </ModalContent>
    </Modal>
  );
}

// https://github.com/chanooda/chanoo
