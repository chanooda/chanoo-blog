import Link, { LinkProps } from 'next/link';
import React from 'react';
import { styled } from 'ui';
import { ChildrenProps } from 'utils';

export interface NextLinkProps extends LinkProps, ChildrenProps {}

export const StyledNextLink = styled('div')`
  & > a {
    text-decoration: none;
    color: ${({ theme }) => theme.palette.text.primary};
    &:hover {
      text-decoration: underline;
    }
  }
`;

export function NextLink({ children, ...props }: NextLinkProps) {
  return (
    <StyledNextLink>
      <Link {...props}>{children}</Link>
    </StyledNextLink>
  );
}
