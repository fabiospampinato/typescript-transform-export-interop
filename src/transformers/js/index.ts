
/* IMPORT */

import findUp from 'find-up-json';
import * as minimist from 'minimist';
import * as path from 'path';
import matches from 'string-matches';
import Utils from '../../utils';

const argv = minimist ( process.argv.slice ( 2 ) );

/* JS */

const JS = {

  re: Utils.parseRe ({
    __esModule: /^Object\.defineProperty \( exports , ['"`]__esModule['"`] , { value : true } \) ;?$\n?/gm,
    exportDefault: /^exports\.default = ([^;\n]+) ;?$/gm,
    exportEquals: /^module\.exports = /gm,
    exportMulti: /^exports\.(?!default)(\w+) = ([^;\n]+) ;?$/gm
  }) as any,

  getFilePath () {

    if ( argv._[0] ) {

      if ( path.isAbsolute ( argv._[0] ) ) return argv._[0];

      return path.resolve ( process.cwd (), argv._[0] );

    }

    const pkg = findUp ( 'package.json' );

    if ( pkg ) {

      if ( path.isAbsolute ( pkg.content.main ) ) return pkg.content.main;

      return path.resolve ( path.dirname ( pkg.path ), pkg.content.main );

    }

  },

  transform () {

    const filePath = JS.getFilePath ();

    if ( !filePath || !Utils.file.exists ( filePath ) ) Utils.exit ( 'Entry file not found' );

    let content = Utils.file.read ( filePath );

    const __esModuleNr = matches ( content, JS.re.__esModule ).length,
          exportDefaultNr = matches ( content, JS.re.exportDefault ).length,
          exportEqualsNr = matches ( content, JS.re.exportEquals ).length,
          exportMultiNr = matches ( content, JS.re.exportMulti ).length;

    if ( exportDefaultNr > 1 ) Utils.exit ( 'Multiple default exports found' );

    if ( exportDefaultNr === 1 ) {

      if ( exportEqualsNr || exportMultiNr ) Utils.exit ( 'Unsupported export' );

      if ( __esModuleNr > 1 ) Utils.exit ( 'More than one "__esModule" found' );

      const exportName = JS.re.exportDefault.exec ( content )[1],
            isSimpleExport = /^\w+$/.test ( exportName );

      if ( !isSimpleExport ) Utils.exit ( 'Only simple default exports are supported' );

      const exportLines = [
        `module.exports = ${exportName};`,
        `module.exports.default = ${exportName};`,
        'Object.defineProperty(module.exports, "__esModule", { value: true });'
      ];

      const result = content.replace ( JS.re.__esModule, '' )
                            .replace ( JS.re.exportDefault, exportLines.join ( '\n' ) );

      Utils.file.write ( filePath, result );

    }

  }

};

/* EXPORT */

export default JS;
