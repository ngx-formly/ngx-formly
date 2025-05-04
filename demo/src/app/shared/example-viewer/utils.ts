import { ExampleType } from './example-viewer.component';
import { COPYRIGHT, dependencies, ngProvider, TEMPLATE_FILES } from '../stackblitz/stackblitz.config';
import { angularVersion } from 'src/schematics/utils/lib-versions';

interface IThemeOption {
  type: string;
  useAnimation?: boolean;
  includeMaterial?: boolean;
  includeAgGrid?: boolean;
  includeFontawesome?: boolean;
  includeNgxTranslate?: boolean;
  appendCopyright?: boolean;
}

export function getExampleFiles(type: string, exampleData: ExampleType): any {
  let appConfig = exampleData.files.find((f) => f.file === 'app.config.ts');
  if (!appConfig) {
    appConfig = {
      file: 'app.config.ts',
      content: require('!!highlight-loader?raw=true&lang=typescript!@assets/stackblitz/app.config.ts'),
      filecontent: require('!!raw-loader!@assets/stackblitz/app.config.ts'),
    };
    exampleData = {
      ...exampleData,
      files: [...exampleData.files, appConfig],
    };
  }
  const appConfigContent = appConfig.filecontent.default;
  exampleData.deps = exampleData.deps || [];

  const options: IThemeOption = { type };

  if (['bootstrap', 'material', 'kendo', 'ionic', 'primeng', 'ng-zorro-antd'].indexOf(options.type) === -1) {
    if (appConfigContent.indexOf('@ngx-formly/bootstrap') !== -1) {
      options.type = 'bootstrap';
    } else if (appConfigContent.indexOf('@ngx-formly/material') !== -1) {
      options.type = 'material';
    } else if (appConfigContent.indexOf('@ngx-formly/kendo') !== -1) {
      options.type = 'kendo';
    } else if (appConfigContent.indexOf('@ngx-formly/ionic') !== -1) {
      options.type = 'ionic';
    } else if (appConfigContent.indexOf('@ngx-formly/primeng') !== -1) {
      options.type = 'primeng';
    } else if (appConfigContent.indexOf('@ngx-formly/ng-zorro-antd') !== -1) {
      options.type = 'ng-zorro-antd';
    }
  }

  if (!options.type) {
    options.type = 'bootstrap';
  }

  if ('material' === options.type || appConfigContent.indexOf('@angular/material') !== -1) {
    options.includeMaterial = true;
  }

  if (
    ['material', 'kendo', 'material', 'primeng'].indexOf(options.type) !== -1 ||
    options.includeMaterial ||
    exampleData.files.some((f) => _getFilecontent(f.filecontent).indexOf('@angular/animations') !== -1)
  ) {
    options.useAnimation = true;
  }

  if (appConfigContent.indexOf('ag-grid-angular') !== -1) {
    options.includeAgGrid = true;
  }

  if (exampleData.deps.indexOf('fontawesome') !== -1) {
    options.includeFontawesome = true;
  }

  if (appConfigContent.indexOf('@ngx-translate/core') !== -1) {
    options.includeNgxTranslate = true;
  }

  const deps = {
    ...dependencies.core,
    ...dependencies[options.type],
  };

  if (options.useAnimation) {
    deps['@angular/animations'] = angularVersion;
  }

  if (options.includeMaterial) {
    deps['@angular/cdk'] = angularVersion;
    deps['@angular/material'] = angularVersion;
  }

  if (options.includeAgGrid) {
    Object.assign(deps, dependencies['ag-grid']);
  }

  if (options.includeNgxTranslate) {
    Object.assign(deps, dependencies['ngx-translate']);
  }

  const files: { [id: string]: string } = {
    'package.json': JSON.stringify(
      {
        name: 'formly-example-app',
        version: '0.0.0',
        scripts: {
          ng: 'ng',
          start: 'ng serve',
          build: 'ng build',
          watch: 'ng build --watch --configuration development',
          test: 'ng test',
        },
        dependencies: deps,
        devDependencies: {
          '@angular-devkit/build-angular': angularVersion,
          '@angular/cli': angularVersion,
          '@angular/compiler-cli': angularVersion,
          '@types/node': '^12.11.1',
          typescript: '~4.7.4',
        },
      },
      null,
      2,
    ),
  };

  const exampleFiles: { [id: string]: string }[] = [];
  [...TEMPLATE_FILES.core, ...(TEMPLATE_FILES[options.type] || []), ...exampleData.files].forEach((data) => {
    let file = data.file;

    if (file.match(/(component|module|type|service|preset|wrapper|extension|config)/)) {
      file = 'app/' + file;
    }

    if (!file.match(/(angular|package|tsconfig|stackblitzrc|favicon)/)) {
      file = 'src/' + file;
    }

    files[file] = _replaceExamplePlaceholderNames(data.file, data.filecontent, options);
    if (data.content) {
      exampleFiles.push({
        file: data.file,
        content: _replaceExamplePlaceholderNames(data.file, data.content, { ...options, appendCopyright: false }),
      });
    }
  });

  return { exampleFiles, files, dependencies: deps };
}

function _replaceExamplePlaceholderNames(filename: string, _filecontent: any, options: IThemeOption): string {
  let filecontent = _getFilecontent(_filecontent);
  if (filename === 'app.config.ts') {
    if (options.type === 'ionic') {
      filecontent = filecontent.replace(
        `'@angular/common';`,
        `'@angular/common';\nimport { IonicModule } from '@ionic/angular';`,
      );
      filecontent = filecontent.replace(`FormlyModule.forRoot`, `IonicModule.forRoot(),\n    FormlyModule.forRoot`);
    }

    if (options.type && filecontent.indexOf(`@ngx-formly/${options.type}`) === -1) {
      if (filecontent.indexOf('hljs') !== -1) {
        filecontent = filecontent.replace(
          `<span class="hljs-string">&#x27;@ngx-formly/core&#x27;</span>`,
          `<span class="hljs-string">&#x27;@ngx-formly/core&#x27;</span>\n<span class="hljs-keyword">import</span> { <span class="hljs-title class_">${
            ngProvider[options.type]
          }</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">'@ngx-formly/${
            options.type
          }'</span>`,
        );
        filecontent = filecontent.replace(
          `<span class="hljs-title class_">ReactiveFormsModule</span>,`,
          `<span class="hljs-title class_">ReactiveFormsModule</span>,\n    <span class="hljs-title class_">${
            ngProvider[options.type]
          }</span>,`,
        );
        filecontent = filecontent.replace(
          `// UI_CONFIG`,
          `...<span class="hljs-title function_">${ngProvider[options.type]}</span>(),`,
        );
      } else {
        filecontent = filecontent.replace(
          `'@ngx-formly/core';`,
          `'@ngx-formly/core';\nimport { ${ngProvider[options.type]} } from '@ngx-formly/${options.type}';`,
        );
        filecontent = filecontent.replace(`// UI_CONFIG`, `...${ngProvider[options.type]}(),`);
      }
    }

    if (options.useAnimation) {
      filecontent = filecontent.replace(
        `'@angular/core';`,
        `'@angular/core';\nimport { provideAnimationsAsync } from '@angular/platform-browser/animations/async';`,
      );
      filecontent = filecontent.replace('provideFormlyCore(', 'provideAnimationsAsync(),\n    provideFormlyCore(');
    }

    if (filecontent.indexOf(`bootstrap: [AppComponent]`) === -1) {
      filecontent = filecontent.replace('declarations: [', `bootstrap: [AppComponent],\n  declarations: [`);
    }
  } else if (filename === 'styles.scss') {
    filecontent = `${filecontent}\nbody { padding: 10px; }`;

    if (options.type !== 'material' && options.includeMaterial) {
      filecontent = `${filecontent}\n@import '@angular/material/prebuilt-themes/deeppurple-amber.css'; `;
    }

    if (options.includeAgGrid) {
      filecontent = `${filecontent}\n@import 'ag-grid-community/dist/styles/ag-grid.css'; `;
      filecontent = `${filecontent}\n@import 'ag-grid-community/dist/styles/ag-theme-balham.css'; `;
    }
  }

  filecontent = filecontent.replace(/formly-app-example/g, 'app-root');
  if (filename === 'index.html' && options.includeFontawesome) {
    filecontent = `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">\n${filecontent}`;
  }

  filecontent = filecontent.replace(/_json/g, '.json');
  if (options.appendCopyright === false) {
    return filecontent;
  }

  return _appendCopyright(filename, filecontent);
}

function _appendCopyright(filename: string, content: string) {
  if (filename.indexOf('.ts') > -1 || filename.indexOf('.scss') > -1) {
    content = `${content}\n\n/**  ${COPYRIGHT} */`;
  } else if (filename.indexOf('.html') > -1) {
    content = `${content}\n\n<!-- ${COPYRIGHT} -->`;
  }
  return content;
}

function _getFilecontent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }

  return content.default;
}
