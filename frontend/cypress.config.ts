import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://todo-app-frontend-1738156783.s3-website.ap-northeast-2.amazonaws.com',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // 여기서 플러그인을 구성할 수 있습니다
    },
  },
});
