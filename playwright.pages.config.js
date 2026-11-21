import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e-pages',timeout:60000,workers:1,
 use:{baseURL:'http://127.0.0.1:4188/vant-catalogo-demo/',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'pages-desktop',use:devices['Desktop Chrome']},{name:'pages-mobile',use:devices['Pixel 7']}],
 webServer:{command:'python -m http.server 4188 --bind 127.0.0.1 --directory dist/pages-test',url:'http://127.0.0.1:4188/vant-catalogo-demo/',reuseExistingServer:false},
});
