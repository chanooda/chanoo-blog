import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Layout } from './components/container/Layout';
import { FolderPage } from './pages/folder/Folder';
import { NotFound } from './pages/404';
import { PostEdit } from './pages/post/edit/postEdit';
import { Write } from './pages/post/write/write';
import { PostDetail } from './pages/post/PostDetail';
import { Post } from './pages/post/Post';

export function Router() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route element={<Home />} path="/" />
        <Route element={<Post />} path="/post" />
        <Route element={<Write />} path="/write" />
        <Route element={<PostDetail />} path="/post/:id" />
        <Route element={<PostEdit />} path="/post/:id/edit" />
        <Route element={<FolderPage />} path="/folder" />
        <Route element={<FolderPage />} path="/folder/:id" />
      </Route>
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}
