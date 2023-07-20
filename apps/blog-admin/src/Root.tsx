import { Route, Routes } from 'react-router-dom';
import { Home } from './Home';

export function Root() {
  return (
    <Routes>
      <Route element={<Home />} path="/" />
    </Routes>
  );
}
