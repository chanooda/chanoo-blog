import React, { useState } from 'react';
import { Button, ButtonGroup, Card, CardContent, IconButton, Popover, Stack, Typography } from 'ui';
import { Folder as FolderIcon, MoreVert } from 'ui-icon';

interface FolderCardProps {
  name: string;
}

export function FolderCard({ name }: FolderCardProps) {
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          border: `1px solid ${theme.palette.primary.main}`
        }
      })}
    >
      <CardContent>
        <Stack alignItems="center" gap={1} height={120} width="100%">
          <Stack alignItems="center" height="100%" justifyContent="center" width="100%">
            <FolderIcon color="primary" fontSize="large" />
          </Stack>
          <Stack>
            <Typography>{name}</Typography>
          </Stack>
        </Stack>
      </CardContent>
      <IconButton
        aria-describedby="folder-edit"
        sx={{ position: 'absolute', right: 10, top: 10 }}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        id="folder-edit"
        open={!!anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        onClose={handleClose}
      >
        <Stack width={80}>
          <ButtonGroup color="inherit" orientation="vertical" size="medium" variant="text">
            <Button>수정</Button>
            <Button>삭제</Button>
          </ButtonGroup>
        </Stack>
      </Popover>
    </Card>
  );
}
