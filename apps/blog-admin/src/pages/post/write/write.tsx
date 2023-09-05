/* eslint-disable react/no-unstable-nested-components */
import MDEditor, { ICommand, commands, image } from '@uiw/react-md-editor';
import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Input,
  MultiSelectInput,
  Popover,
  Stack,
  TextField,
  Typography,
  useSnackbar
} from 'ui';
import { Image, Source } from 'ui-icon';
import { day } from 'utils';
import { FieldErrors, GlobalError, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { WriteImageAddModal } from '../../../components/modal/WriteImageAddModal';
import { WriteEmbedAddModal } from '../../../components/modal/WriteEmbedAddModal';
import { convertLink } from '../../../libs/writerUtils';
import { MdPreview } from '../../../components/markdown/MdPreview';
import { useChanooMutation, useChanooQuery } from '../../../libs/queryHook';
import { SeriesRes, TagRes, WriteRes } from '../../../types/res';

export type ModalType = 'image' | 'embed' | '';

interface WritingForm {
  mainImage: string;
  series: string;
  tag: string[];
  title: string;
}

interface WritingProps {
  id?: string;
}

export function Write({ id }: WritingProps) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const insertImageRef = useRef<HTMLButtonElement>(null);
  const insertEmbedRef = useRef<HTMLButtonElement>(null);
  const [modalType, setModalType] = useState<ModalType>('');
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [showImageAddModal, setShowImageAddModal] = useState(false);
  const [hideInfo, setHideInfo] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({
    vertical: 0,
    horizontal: 0
  });
  const { enqueueSnackbar } = useSnackbar();

  const { data: write } = useChanooQuery<WriteRes, GlobalError>([`/write/${id}`], {
    enabled: !!id,
    useErrorBoundary: true
  });
  const { register, watch, setValue, handleSubmit, reset } = useForm<WritingForm>({
    defaultValues: {
      tag: []
    }
  });

  const initialTagList = useMemo(
    () => [...(write?.data?.data?.tags?.map((tag) => tag.tag.name) || [])],
    [write?.data?.data]
  );
  const [editorValue, setEditorValue] = useState(write?.data?.data?.content || '');

  const { data: seriesList } = useChanooQuery<SeriesRes[], GlobalError>(['/series']);
  const { data: tagList } = useChanooQuery<TagRes[], GlobalError>(['/tag']);
  const { mutate: createWrite } = useChanooMutation<WriteRes, GlobalError, FormData>([
    'POST',
    '/write',
    (data) => data
  ]);
  const { mutate: updateWrite } = useChanooMutation<
    WriteRes,
    GlobalError,
    { formData: FormData; writeId: string }
  >(['PATCH', ({ writeId }) => `/write/${writeId}`, ({ formData }) => formData]);

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

  const getWriteFormData = (formData: WritingForm, type: 'save' | 'write' | 'update') => {
    const { mainImage, series, tag, title } = formData;

    const writeFormData = new FormData();
    writeFormData.append('title', title);
    writeFormData.append('content', editorValue);
    writeFormData.append('imgUrl', mainImage);
    writeFormData.append('seriesName', series);
    writeFormData.append('isPublish', JSON.stringify(type === 'save' ? 'false' : 'true'));
    writeFormData.append('tagNames', JSON.stringify(tag));

    return writeFormData;
  };

  const formErrorHandler = (error: FieldErrors<WritingForm>) => {
    Object.values(error || {}).forEach((err) => {
      if (err?.message) {
        enqueueSnackbar({
          message: err.message,
          variant: 'error'
        });
      }
    });
  };

  const updateWriteSubmitHandler = handleSubmit(
    (formData) => {
      if (!id) return;
      const writeFormData = getWriteFormData(formData, 'save');

      updateWrite(
        { formData: writeFormData, writeId: id },
        {
          onSuccess() {
            enqueueSnackbar({
              message: '글 수정 완료!',
              variant: 'success'
            });

            client.invalidateQueries([`/write/${id}`]);
          }
        }
      );
    },
    (error) => {
      formErrorHandler(error);
    }
  );

  const saveWriteSubmitHandler = handleSubmit(
    (formData) => {
      const writeFormData = getWriteFormData(formData, 'save');
      createWrite(writeFormData, {
        onSuccess(data) {
          enqueueSnackbar({
            message: '임시 저장 완료!',
            variant: 'success'
          });
          const writeId = data?.data?.data?.id;
          navigate(`/writing/${writeId}`);
        }
      });
    },
    (error) => {
      formErrorHandler(error);
    }
  );

  const writeSubmitHandler = handleSubmit(
    (formData) => {
      const writeFormData = getWriteFormData(formData, 'write');
      createWrite(writeFormData, {
        onSuccess(data) {
          enqueueSnackbar({
            message: '임시 저장 완료!',
            variant: 'success'
          });
          const writeId = data?.data?.data?.id;
          navigate(`/write/${writeId}`);
        }
      });
    },
    (error) => {
      formErrorHandler(error);
    }
  );

  const insertImage: ICommand = {
    value: 'image',
    name: 'image',
    keyCommand: 'image',
    shortcuts: image.shortcuts,
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
    bold,
    italic,
    hr,
    title,
    divider,
    unorderedListCommand,
    orderedListCommand,
    checkedListCommand,
    divider,
    insertImage,
    embed
  ];

  useEffect(() => {
    reset({
      tag: initialTagList || [],
      title: write?.data?.data?.title || '',
      mainImage: write?.data?.data?.imgUrl || '',
      series: write?.data?.data?.series.name || ''
    });
    setEditorValue(write?.data?.data?.content || '');
  }, [write?.data?.data]);

  return (
    <>
      <Stack
        className="container light"
        direction="row"
        height="100%"
        width="100%"
        sx={{
          '.w-md-editor': {
            width: '100%'
          }
        }}
      >
        <Stack
          borderRight={({ palette }) => `1px solid ${palette.grey[300]}`}
          height="100%"
          width="50%"
        >
          {!hideInfo ? (
            <Stack
              gap={2}
              height={300}
              justifyContent="center"
              minHeight={300}
              overflow="auto"
              px={2}
              py={1}
            >
              <TextField
                placeholder="제목을 입력해주세요."
                size="small"
                type="text"
                variant="standard"
                {...register('title', {
                  required: '제목을 입력해주세요.'
                })}
              />
              <Input inputProps={{ list: 'series' }} {...register('series')} placeholder="시리즈" />

              <datalist id="series">
                {seriesList?.data?.data?.map((series) => (
                  <option key={series.id} value={series.name}>
                    {series.name}
                  </option>
                ))}
              </datalist>
              <MultiSelectInput
                initialValue={initialTagList}
                placeholder="태그"
                selectOptionList={tagList?.data?.data?.map((tag) => ({
                  label: tag.name,
                  value: tag.name
                }))}
                {...register('tag')}
              />
              <Stack direction="row" justifyContent="space-between" width="100%">
                <Button
                  color="secondary"
                  sx={{ maxWidth: 130 }}
                  variant="contained"
                  onClick={() => setShowImageAddModal(true)}
                >
                  메인 이미지 추가
                </Button>
                <Button color="secondary" onClick={() => setHideInfo(true)}>
                  접기
                </Button>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                {!id && (
                  <>
                    <Button variant="outlined" onClick={saveWriteSubmitHandler}>
                      임시저장
                    </Button>
                    <Button variant="contained" onClick={writeSubmitHandler}>
                      글쓰기
                    </Button>
                  </>
                )}
                {id && (
                  <Button
                    sx={{ ml: 'auto' }}
                    variant="contained"
                    onClick={updateWriteSubmitHandler}
                  >
                    저장하기
                  </Button>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack width="100%">
              <Button color="secondary" onClick={() => setHideInfo(false)}>
                펼치기
              </Button>
            </Stack>
          )}
          <Stack height="100%" minHeight={0}>
            <MDEditor
              commands={[...newCommands]}
              height="100%"
              preview="edit"
              value={editorValue}
              onChange={setEditorValue as any}
              onContextMenu={contextMenuHandler}
            />
          </Stack>
        </Stack>
        <Stack height="100%" width="50%">
          <Stack
            direction="column"
            height="100%"
            overflow="auto"
            px={2}
            sx={{ overflow: 'auto' }}
            width="100%"
          >
            <Stack direction="column" width="100%">
              <Box component="h1" my={0}>
                {watch('title')}
              </Box>
              <Stack direction="row" mt={1}>
                <Typography fontWeight={600}>김찬우</Typography> ・
                <Typography color="grey.700">{day.todayFull}</Typography>
              </Stack>
              {watch('tag') && (
                <Stack direction="row" flexWrap="wrap" gap={2} mt={2} width="100%">
                  {watch('tag').map((tag) => (
                    <Chip key={tag} label={tag} />
                  ))}
                </Stack>
              )}
              {watch('series') && (
                <Stack bgcolor="grey.200" borderRadius={2} height={100} mt={2} p={2} width="100%">
                  <Typography variant="h6">{watch('series')}</Typography>
                </Stack>
              )}
              {watch('mainImage') && (
                <Box mt={2} width="100%">
                  <Box
                    alt="메인 이미지"
                    component="img"
                    src={watch('mainImage')}
                    sx={{ objectFit: 'cover', aspectRatio: 16 / 9 }}
                    width="100%"
                  />
                </Box>
              )}
            </Stack>
            <MdPreview>{editorValue}</MdPreview>
          </Stack>
        </Stack>
      </Stack>
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
      <WriteImageAddModal
        open={showImageAddModal}
        onClose={() => setShowImageAddModal(false)}
        onChooseImage={(url: string) => {
          setValue('mainImage', url);
          setShowImageAddModal(false);
        }}
      />
    </>
  );
}
