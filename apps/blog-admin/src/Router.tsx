import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { Layout } from './components/container/Layout';
import { Writing } from './pages/Writing';
import { Write } from './pages/Write';
import { Files } from './pages/Files';

export function Router() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route element={<Home />} path="/" />
        <Route element={<Writing />} path="/writing" />
        <Route element={<Write />} path="/Write" />
        <Route element={<Files />} path="/files" />
      </Route>
    </Routes>
  );
}
