import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' にしておくと、GitHub Pages のようなサブパス配信でもそのまま動きます
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
