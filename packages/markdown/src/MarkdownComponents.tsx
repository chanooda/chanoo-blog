/* eslint-disable react/function-component-definition */
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, EllipsisTypography, Stack } from 'ui';
import { Components } from 'react-markdown';
import { useEffect, useState } from 'react';
import { githubRepoInfo, githubUserInfo } from './markdownType';
import { convertLink } from './markdownUtils';

export const Code: Components['code'] = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter {...props} PreTag="div" language={match[1]} style={vscDarkPlus}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <Box
      bgcolor="rgba(135,131,120,0.15)"
      borderRadius={1}
      color="#EB5757"
      component="code"
      px={1}
      {...props}
      className={className}
    >
      {children}
    </Box>
  );
};

export const Img: Components['img'] = ({ src, alt, ...props }) => {
  return <Box alt={alt} component="img" maxWidth="100%" src={src} {...props} />;
};

export const A: Components['a'] = ({ children, href, target, ...props }) => {
  if (href?.indexOf('https://youtu.be/') !== -1)
    return (
      <Box
        border="none"
        component="iframe"
        height="auto"
        src={convertLink(href || '')}
        sx={{ aspectRatio: 16 / 9 }}
        title={href}
        width="100%"
      />
    );
  if (href.indexOf('https://github.com/') !== -1) {
    const splitUrl = href.replace('https://', '').split('/');
    const [repoInfo, setRepoInfo] = useState<typeof githubRepoInfo | undefined>(undefined);
    const [userInfo, serUserInfo] = useState<typeof githubUserInfo | undefined>(undefined);
    const owner = splitUrl[1];
    const repo = splitUrl[2];

    useEffect(() => {
      if (owner && repo) {
        (async () => {
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          const data = (await res.json()) as typeof githubRepoInfo;
          setRepoInfo(data);
        })();
      }
      if (owner) {
        (async () => {
          const res = await fetch(`https://api.github.com/users/${owner}`);
          const data = (await res.json()) as typeof githubUserInfo;
          serUserInfo(data);
        })();
      }
    }, []);

    if (repoInfo) {
      return (
        <Stack
          border={({ palette }) => `1px solid ${palette.grey[300]}`}
          borderRadius={1}
          component="a"
          direction="row"
          height="106px"
          href={href}
          overflow="hidden"
          target={target}
        >
          <Stack height="100%" p={1} width="70%">
            <EllipsisTypography>Github - {repoInfo.full_name}</EllipsisTypography>
            <EllipsisTypography height={42} sx={{ WebkitLineClamp: 2 }} variant="body2">
              {repoInfo.description}
            </EllipsisTypography>
            <Stack alignItems="center" direction="row" gap={1}>
              <Stack minHeight={16} minWidth={16}>
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </Stack>
              <EllipsisTypography variant="caption">{repoInfo.html_url}</EllipsisTypography>
            </Stack>
          </Stack>
          <Box
            alt={href}
            component="img"
            height="100%"
            src={convertLink(href)}
            sx={{ aspectRatio: '1/2' }}
            width="30%"
          />
        </Stack>
      );
    }
    if (userInfo) {
      return (
        <Stack
          border={({ palette }) => `1px solid ${palette.grey[300]}`}
          borderRadius={1}
          component="a"
          direction="row"
          gap={1}
          height="104px"
          href={href}
          target={target}
          width="100%"
        >
          <Box alt="profile" component="img" minWidth={104} src={userInfo.avatar_url} width={104} />
          <Stack overflow="hidden" p={1} width="100%">
            <EllipsisTypography variant="body1">{userInfo.name}</EllipsisTypography>
            <EllipsisTypography
              color="grey.700"
              height={42}
              sx={{ WebkitLineClamp: 2 }}
              variant="body2"
            >
              {userInfo.bio}
            </EllipsisTypography>
            <Stack alignItems="center" direction="row" gap={1} mt="auto">
              <Stack height={16} minHeight={16} minWidth={16} width={16}>
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </Stack>
              <EllipsisTypography variant="caption">{userInfo.html_url}</EllipsisTypography>
            </Stack>
            {/* <Stack>
                <EllipsisTypography variant="body2">{userInfo.blog}</EllipsisTypography>
                <EllipsisTypography variant="body2">{userInfo.company}</EllipsisTypography>
              </Stack> */}
          </Stack>
        </Stack>
      );
    }
  }
  return (
    <Box
      color="grey.700"
      component="a"
      href={href}
      sx={{ textDecoration: 'underline' }}
      target={target}
      {...props}
    >
      {children}
    </Box>
  );
};

export const Blockquote: Components['blockquote'] = ({ ...props }) => {
  return (
    <Box
      component="blockquote"
      py={1}
      {...props}
      sx={({ palette }) => ({
        margin: 0,
        padding: '0 1em',
        color: 'inherit',
        borderLeft: `0.25em solid ${palette.grey[800]}`
      })}
    />
  );
};
