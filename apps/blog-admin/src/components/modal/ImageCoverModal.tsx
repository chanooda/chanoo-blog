import { Box, Modal, ModalProps } from 'ui';
import { useEffect, useRef, useState } from 'react';
import { ModalContent } from './ModalContent';
import { Image } from '../../types/image';

interface ImageCoverModalProps extends Omit<ModalProps, 'children'> {
  image?: Image;
}

export function ImageCoverModal({ open, onClose, image }: ImageCoverModalProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const imageElement = imageRef?.current;

    if (window.innerWidth <= 500) {
      setImageSize(() => ({
        height: window.innerHeight - 20,
        width: window.innerWidth
      }));
    } else {
      setImageSize(() => ({
        height: window.innerHeight - 100,
        width: window.innerWidth - 100
      }));
    }

    const windowResizeHandler = () => {
      if (imageElement) {
        if (window.innerWidth <= 500) {
          setImageSize(() => ({
            height: window.innerHeight - 20,
            width: window.innerWidth
          }));
        } else {
          setImageSize(() => ({
            height: window.innerHeight - 100,
            width: window.innerWidth - 100
          }));
        }
      }
    };

    window?.addEventListener('resize', windowResizeHandler);
    return () => window?.removeEventListener('resize', windowResizeHandler);
  }, []);

  return (
    <Modal
      keepMounted
      open={open}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(1,1,1,0.9)'
          }
        }
      }}
      onClose={onClose}
    >
      <ModalContent noBackground>
        <Box
          alt={image?.originalname}
          component="img"
          ref={imageRef}
          src={image?.url}
          sx={{
            maxWidth: imageSize.width !== 0 ? imageSize.width : 'auto',
            maxHeight: imageSize.height !== 0 ? imageSize.height : 'auto'
          }}
        />
      </ModalContent>
    </Modal>
  );
}
