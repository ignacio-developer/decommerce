import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        base: "http://localhost:8001",
        define: {
            "process.env.APP_URL": JSON.stringify(env.APP_URL),
        },
        plugins: [
            react(),
            laravel({
                input: [
                    "resources/css/app.css",
                    "resources/js/src/components/styles.css",
                    "resources/js/src/index.jsx",
                ],
                refresh: true,
            }),
            viteStaticCopy({
                targets: [
                    {
                        src: 'public/fonts/*',
                        dest: 'fonts',
                    }
                ]
            }),
        ],
    };
});
