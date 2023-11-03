import Link, { LinkProps } from 'next/link';
import React from 'react';
import { styled } from 'ui';

type NextLinkProps = LinkProps;

export const StyledNextLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.palette.text.primary};
  &:hover {
    text-decoration: underline;
  }
`;

export function NextLink({ ...props }: NextLinkProps) {
  return <StyledNextLink {...props} />;
}
