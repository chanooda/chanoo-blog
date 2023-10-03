/* eslint-disable react/no-unstable-nested-components */
import MDEditor, { ICommand, MDEditorProps, commands } from '@uiw/react-md-editor';
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { IconButton, Popover, Stack } from 'ui';
import { Image, Source } from 'ui-icon';
import { convertLink } from 'markdown';
import { WriteImageAddModal } from '../modal/WriteImageAddModal';
import { WriteEmbedAddModal } from '../modal/WriteEmbedAddModal';

export type ModalType = 'image' | 'embed' | '';

export type MarkdownEditorProps = MDEditorProps;

export function MarkdownEditor({ ...props }: MarkdownEditorProps) {
  const insertImageRef = useRef<HTMLButtonElement>(null);
  const insertEmbedRef = useRef<HTMLButtonElement>(null);

  const [modalType, setModalType] = useState<ModalType>('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [showImageAddModal, setShowImageAddModal] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({
    vertical: 0,
    horizontal: 0
  });

  const contextMenuHandler = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === document.querySelector('textarea.w-md-editor-text-input')) {
      e.preventDefault();
      setPopoverPosition({
        horizontal: e.nativeEvent.offsetX,
        vertical: e.nativeEvent.offsetY
      });
      setAnchorEl(e.currentTarget);
    }
  };

  const closeOptionHandler = () => {
    setAnchorEl(null);
  };

  const closeModalHandler = () => {
    closeOptionHandler();
    setModalType('');
  };

  const popoverContextMenuHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    closeOptionHandler();
  };

  const insertImage: ICommand = {
    value: 'image',
    name: 'image',
    keyCommand: 'image',
    children: ({ textApi, close }) => {
      return (
        <WriteImageAddModal
          open={modalType === 'image'}
          onChooseImage={(url: string) => {
            textApi?.replaceSelection(`![image](${url})`);
            close();
            setModalType('');
          }}
          onClose={() => {
            closeModalHandler();
            close();
          }}
        />
      );
    },
    render(command, disabled, executeCommand) {
      return (
        <IconButton
          ref={insertImageRef}
          size="small"
          sx={{
            width: 20,
            height: 15
          }}
          onClick={() => {
            executeCommand(command);
          }}
        >
          <Image fontSize="inherit" />
        </IconButton>
      );
    },
    execute() {
      setModalType((prev) => (prev === 'image' ? '' : 'image'));
    }
  };

  const embed: ICommand = {
    name: 'embed',
    keyCommand: 'embed',
    render: (command, disabled, executeCommand) => (
      <IconButton
        ref={insertEmbedRef}
        size="small"
        sx={{
          width: 20,
          height: 15
        }}
        onClick={() => {
          executeCommand(command);
        }}
      >
        <Source fontSize="inherit" />
      </IconButton>
    ),
    children: ({ textApi, close }) => {
      return (
        <WriteEmbedAddModal
          open={modalType === 'embed'}
          getEmbedUrl={(url: string) => {
            textApi?.replaceSelection(convertLink(url));
            close();
            closeModalHandler();
          }}
          onClose={() => {
            close();
            closeModalHandler();
          }}
        />
      );
    },
    execute() {
      setModalType((prev) => (prev === 'embed' ? '' : 'embed'));
    }
  };

  const {
    bold,
    italic,
    hr,
    title,
    divider,
    unorderedListCommand,
    orderedListCommand,
    checkedListCommand
  } = commands;

  const newCommands = [
    { ...bold, shortcuts: '' },
    { ...italic, shortcuts: '' },
    { ...hr, shortcuts: '' },
    { ...title, shortcuts: '' },
    { ...divider, shortcuts: '' },
    { ...unorderedListCommand, shortcuts: '' },
    { ...orderedListCommand, shortcuts: '' },
    { ...checkedListCommand, shortcuts: '' },
    { ...unorderedListCommand, shortcuts: '' },
    { ...insertImage, shortcuts: '' },
    { ...embed, shortcuts: '' }
  ];

  const editorKeydownHandler = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === 'i') {
        console.log('insert image');
        insertImageRef?.current?.click();
      }
      if (e.key === 'e') {
        console.log('insert embed');
        insertEmbedRef?.current?.click();
      }
    }
  };

  // useEffect(() => {
  //   const editor = document.getElementById('editor');
  //   const keydownHandler = (e: KeyboardEvent) => {
  //     if (e.metaKey || e.ctrlKey) {
  //       if (e.key === 'i') {
  //         console.log('insert image');
  //         insertImageRef?.current?.click();
  //       }
  //       if (e.key === 'e') {
  //         console.log('insert embed');
  //         insertEmbedRef?.current?.click();
  //       }
  //     }
  //   };
  //   editor?.addEventListener('keydown', keydownHandler);

  //   () => editor?.removeEventListener('keydown', keydownHandler);
  // }, []);

  return (
    <>
      <MDEditor
        commands={[...newCommands]}
        height="100%"
        id="editor"
        preview="edit"
        spellCheck={false}
        onContextMenu={contextMenuHandler}
        onKeyDown={editorKeydownHandler}
        {...props}
      />

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={popoverPosition}
        id="folder-edit"
        open={!!anchorEl}
        onClose={closeOptionHandler}
        onContextMenu={popoverContextMenuHandler}
      >
        <Stack direction="row">
          <IconButton size="large" onClick={() => insertImageRef.current?.click()}>
            <Image />
          </IconButton>
          <IconButton size="large" onClick={() => insertEmbedRef.current?.click()}>
            <Source />
          </IconButton>
        </Stack>
      </Popover>
    </>
  );
}
