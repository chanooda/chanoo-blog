import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { Layout } from './components/container/Layout';
import { Writing } from './pages/Writing';
import { Write } from './pages/Write';
import { FolderPage } from './pages/Folder';
import { NotFound } from './pages/404';

export function Router() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route element={<Home />} path="/" />
        <Route element={<Writing />} path="/writing" />
        <Route element={<Write />} path="write" />
        <Route element={<FolderPage />} path="/folder" />
      </Route>
      <Route element={<NotFound />} path="*" />
    </Routes>
  );
}
