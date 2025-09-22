// // setup-sse.js - Script completo de configuración de Serenity + Playwright + TS con SSE
// import fs from 'fs-extra';
// import path from 'path';
// import { spawn } from 'child_process';

// // Logging SSE
// function log(msg, stream) {
//   if (stream && stream.write) stream.write(`data: ${msg}\n\n`);
//   console.log(msg);
// }

// // Ejecutar comando shell con logs en tiempo real
// function run(cmd, cwd = process.cwd(), stream) {
//   return new Promise((resolve, reject) => {
//     log(`\n> ${cmd}`, stream);
//     const child = spawn(cmd, { shell: true, cwd });

//     child.stdout.on('data', (data) => log(data.toString().trim(), stream));
//     child.stderr.on('data', (data) => log(data.toString().trim(), stream));

//     child.on('close', (code) => {
//       if (code === 0) resolve();
//       else reject(new Error(`${cmd} exited with code ${code}`));
//     });
//   });
// }

// // Crear archivo
// function writeFile(filePath, content, stream) {
//   fs.outputFileSync(filePath, content, 'utf8');
//   log(`Archivo creado: ${filePath}`, stream);
// }

// // Generación del proyecto
// export async function generateProject(projectName, stream) {
//   if (!projectName) throw new Error('El nombre del proyecto es obligatorio');
  
//   const projectPath = path.join(process.cwd(), projectName);
//   fs.ensureDirSync(projectPath);
//   log(`==> Creando proyecto: ${projectName}`, stream);





// setup-sse.js - Generación completa Serenity + Playwright + TS con SSE y logs en tiempo real
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

// --------------------- Logging SSE ---------------------
function log(msg, stream) {
  if (stream && stream.write) stream.write(`data: ${msg}\n\n`);
  console.log(msg);
}

// --------------------- Ejecutar comando shell con logs ---------------------
function run(cmd, cwd, stream) {
  return new Promise((resolve, reject) => {
    log(`\n> ${cmd}`, stream);
    const child = spawn(cmd, { shell: true, cwd });

    child.stdout.on('data', (data) => log(data.toString().trim(), stream));
    child.stderr.on('data', (data) => log(data.toString().trim(), stream));

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

// --------------------- Crear archivo ---------------------
function writeFile(filePath, content, stream) {
  fs.outputFileSync(filePath, content, 'utf8');
  log(`Archivo creado: ${filePath}`, stream);
}

// --------------------- Generación del proyecto ---------------------
export async function generateProject(projectName, options = {}) {
  if (!projectName) throw new Error('El nombre del proyecto es obligatorio');
  const stream = options.write || console.log;

  // Carpeta temporal para Vercel
  const baseDir = options.path || os.tmpdir();
  const projectPath = path.join(baseDir, projectName);
  fs.ensureDirSync(projectPath);
  log(`==> Creando proyecto: ${projectName} en ${projectPath}`, stream);

  // Inicialización Node
  await run('npm init -y', projectPath, stream);
  log("📁 npm init -y...");
  await fs.ensureDir(projectPath);

  // Dependencias
//   const deps = [
//     "typescript","ts-node","@types/node",
//     "@serenity-js/core@latest",
//     "@serenity-js/cucumber@latest",
//     "@serenity-js/playwright@latest",
//     "@serenity-js/serenity-bdd@latest",
//     "@serenity-js/assertions@latest",
//     "@serenity-js/web@latest",
//     "@cucumber/cucumber@latest",
//     "playwright@latest",
//     "dotenv@latest",
//     "chai","@types/chai",
//     "rimraf@latest"
//   ];
//   await run(`npm install --save-dev ${deps.join(' ')}`, projectPath, stream);
//   await run('npm audit fix --force', projectPath, stream);
//   log("🔧 Instalando dependencias...");
//   await new Promise((r) => setTimeout(r, 1500));

//   // Playwright navegadores
//   await run('npx playwright install', projectPath, stream);


// --------------------- Sobrescribir package.json con dependencias fijas ---------------------
  const pkg = {
    name: projectName,
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: "npx cucumber-js"
    },
    devDependencies: {
        "typescript": "^5.2.2",
        "ts-node": "^10.9.1",
        "@types/node": "^20.5.1",
        "@serenity-js/core": "^3.35.0",
        "@serenity-js/cucumber": "^3.35.0",
        "@serenity-js/playwright": "^3.35.0",
        "@serenity-js/serenity-bdd": "^3.35.0",
        "@serenity-js/assertions": "^3.35.0",
        "@serenity-js/web": "^3.35.0",
        "@cucumber/cucumber": "^9.0.0",
        "playwright": "^1.41.1",
        "dotenv": "^16.1.4",
        "chai": "^4.3.8",
        "@types/chai": "^4.3.5",
        "rimraf": "^5.0.0"
    }
  };
  await fs.outputFile(path.join(projectPath, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');
  log(`package.json creado con dependencias fijas`, stream);

  // --------------------- Instalar dependencias ---------------------
//   await run('npm install', projectPath, stream);
//   log("🔧 Dependencias instaladas correctamente", stream);

  // --------------------- Inicializar Node y Playwright ---------------------
//   await run('npx playwright install', projectPath, stream);

  // Carpetas
  const dirs = [
    'src/PageObject','src/Questions','src/Model','src/Tasks',
    'src/StepsDefinitions','src/Util','src/Resource/SetData',
    'src/Resource/features','src/config','.github/workflows'
  ];
  dirs.forEach(dir => {
    fs.ensureDirSync(path.join(projectPath, dir));
    log(`Carpeta creada: ${dir}`, stream);
  });

  // Archivos iniciales
  writeFile(path.join(projectPath, '.env'), `
BASE_URL=https://mcstaging.supermercadosnacional.com/customer/account/create/
HEADLESS=false
TAGS=@smoke
BROWSER=chrome
IMPLICIT_WAIT=10
  `.trim(), stream);

  writeFile(path.join(projectPath, 'src/config/env.ts'), `
import 'dotenv/config';
export const Env = {
  baseUrl: process.env.BASE_URL ?? 'https://mcstaging.supermercadosnacional.com/',  
};
  `.trim(), stream);

  writeFile(path.join(projectPath,'src/config/hooks.ts'), `
import { actorCalled, configure } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { TakeScreenshot } from '@serenity-js/web';
import { chromium } from 'playwright';
import { Before, After, setWorldConstructor, BeforeAll, AfterStep } from '@cucumber/cucumber';
import path from 'path';

export class CustomWorld { actor: any; }
setWorldConstructor(CustomWorld);

Before({ timeout: 40000 }, async function () {
  const headless = await process.env.HEADLESS === 'true' || false;  
  //const headless = await process.env.HEADLESS !== 'false';
  const browser = await chromium.launch({ 
    channel: 'chrome',
    headless: headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--start-maximized'
    ]
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  this.actor = actorCalled('Tester User').whoCan(
    BrowseTheWebWithPlaywright.usingPage(page)
  );

  this.cleanup = async () => {
    await page.close();
    await context.close();
    await browser.close();
  }
});

BeforeAll({ timeout: 40000 }, async function() {
  console.log('BeforeAll: Starting test suite...');
  configure({
    crew: [
      ['@serenity-js/serenity-bdd', { 
        specDirectory: path.resolve(__dirname,'../Resource/features'),
        reporter:{ includeAbilityDetails: true },
      }],
      ['@serenity-js/core:ArtifactArchiver', {
        outputDirectory: path.resolve(__dirname,'../../target/site/serenity'),
      }]
    ]
  });
});

After(async function () {  if (this.cleanup) {    await this.cleanup();  }});

AfterStep(async function () {  if(this.actor){    await this.actor.attemptsTo(TakeScreenshot.of('step')   );  }});
  `.trim(), stream);

  writeFile(path.join(projectPath,'src/Tasks/OpenPage.ts'), `
import { Task, Interaction } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

export class OpenPage {
  static atBaseUrl(){
    return Task.where('#open the application base URL',
      Navigate.to(process.env.BASE_URL || 'https://mcstaging.supermercadosnacional.com/'),
      Interaction.where('#wait for 20 seconds', async() => {
        await new Promise(resolve => setTimeout(resolve, 20000));
      })
    );
  }
}
  `.trim(), stream);

  writeFile(path.join(projectPath,'src/StepsDefinitions/OpenPage.steps.ts'), `
import { Given, Then } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { OpenPage } from '../Tasks/OpenPage';
import { CustomWorld } from '../config/hooks';
import { ReviweHomePage } from '../Questions/ReviweHomePage';

Given('the user opens the application', { timeout: 40000 }, async function (this: CustomWorld) {
  console.log('🚀 Opening the application');
  await this.actor.attemptsTo(OpenPage.atBaseUrl());
});

Then('the user should see the homepage',{ timeout: 40000 }, async function (this: CustomWorld) {
  console.log('👀 Verifying the homepage is visible');
  await this.actor.attemptsTo(Ensure.that(ReviweHomePage.isVisibleMainContent, equals(true)));
});

Then('the page title should be My Store',{ timeout: 40000 }, async function (this: CustomWorld) {
  console.log('🔖 Checking the page title is My Store');
  await this.actor.attemptsTo(Ensure.that(this.actor.answer(ReviweHomePage.isVisibleTitle), equals(true)));
});
  `.trim(), stream);

// PageObject
writeFile(path.join(projectPath,'src/PageObject/Home.page.ts'), `
export class HomePage {
  static readonly FORM_TITLE = '//div[@class="block-title"]//div[@class="form-title__logos"]';
  static readonly MAIN_CONTENT = '//main[@id="maincontent"]';
}
  `.trim(), stream);

// Questions
writeFile(path.join(projectPath,'src/Questions/ReviweHomePage.ts'), `
import { Question, Wait, AnswersQuestions, UsesAbilities, Duration} from '@serenity-js/core';
import { PageElement, By, isVisible } from '@serenity-js/web';
import { HomePage } from '../PageObject/Home.page';

export class ReviweHomePage {
  public static readonly isVisibleMainContent = Question.about('the main content of the page', async (actor: AnswersQuestions & UsesAbilities) =>{
      Wait.upTo(Duration.ofSeconds(10)).until(
          PageElement.located(By.xpath(HomePage.MAIN_CONTENT)).describedAs('Main Content'),
          isVisible()
      );
      const element_mainContent = PageElement.located(By.xpath(HomePage.MAIN_CONTENT));
      return await actor.answer(element_mainContent.isVisible());
  });

  public static readonly isVisibleTitle = Question.about('the title of the form', async (actor: AnswersQuestions & UsesAbilities) =>{
      Wait.upTo(Duration.ofSeconds(10)).until(
          PageElement.located(By.xpath(HomePage.FORM_TITLE)).describedAs('Form Title'),
          isVisible()
      );
      const element_formTitle = PageElement.located(By.xpath(HomePage.FORM_TITLE));
      return await actor.answer(element_formTitle.isVisible());
  });
}
  `.trim(), stream);

// Feature
writeFile(path.join(projectPath,'src/Resource/features/open_page.feature'), `
Feature: Open application

  @smoke
  Scenario: User opens the base URL
    Given the user opens the application
    Then the user should see the homepage
    And the page title should be My Store
  `.trim(), stream);

// cucumber.js
writeFile(path.join(projectPath,'cucumber.js'), `
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/StepsDefinitions/**/*.ts', 'src/config/**/*.ts'],
    paths: ['src/Resource/features/**/*.feature'],
    format: ['@serenity-js/cucumber','summary','progress-bar'],
    tags: process.env.TAGS || '@smoke'
  }
};
  `.trim(), stream);

// tsconfig.json
writeFile(path.join(projectPath,'tsconfig.json'), `
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "ignoreDeprecations": "6.0",
    "resolveJsonModule": true,
    "outDir": "dist"
  }
}
  `.trim(), stream);

// .gitignore
writeFile(path.join(projectPath,'.gitignore'), `
node_modules/
npm-debug.log
yarn-error.log
dist/
target/
.serenity/
coverage/
.env
.vscode/
.idea/
  `.trim(), stream);

// GitHub Actions workflow
writeFile(path.join(projectPath,'.github/workflows/serenity-report.yml'), `
name: Serenity BDD Report

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Install Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Run tests and generate Serenity JSON
        run: >
          npx cucumber-js --require-module ts-node/register --require src/config/hooks.ts src/StepsDefinitions/**/*.ts src/Resource/features/**/*.feature --format @serenity-js/cucumber --format-options "{\\"outputDirectory\\": \\"target/site/serenity\\", \\"specDirectory\\": \\"src/Resource/features\\"}"
        continue-on-error: true
      - name: Generate Serenity BDD HTML report
        run: npx serenity-bdd run
      - name: Upload Serenity report artifact
        uses: actions/upload-artifact@v4
        with:
          name: serenity-report
          path: target/site/serenity
      - name: Deploy Serenity Report to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{secrets.GITHUB_TOKEN}}
          publish_dir: ./target/site/serenity
  `.trim(), stream);

// Ejecutar prueba inicial
// log('==> Ejecutando prueba inicial...', stream);
// try {
//   await run('npx cucumber-js --require-module ts-node/register --require src/config/hooks.ts src/StepsDefinitions/**/*.ts src/Resource/features/**/*.feature --format @serenity-js/cucumber', projectPath, stream);
//   log('✅ Prueba inicial completada', stream);
// } catch (err) {
//   log(`⚠️ Error prueba inicial: ${err.message}`, stream);
// }

log(`\n✅ Proyecto "${projectName}" generado en ${projectPath}`, stream);
return projectPath;
}