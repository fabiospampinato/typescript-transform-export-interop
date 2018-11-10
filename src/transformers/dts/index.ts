
/* IMPORT */

import * as _ from 'lodash';
import * as detectIndent from 'detect-indent';
import matches from 'string-matches';
import Config from '../../config';
import Utils from '../../utils';
import JS from '../js';

/* DTS */

const DTS = {

  re: Utils.parseRe ({
    exportAll: /^export \* from/gm,
    exportDefault: /^export default (\w*) ;?$/gm,
    exportEquals: /^export = /gm,
    exportMulti: /^export {([^}]*)} ;?$/gm,
    exportOther: /^export (?:function|class|var|let|class|type|interface|namespace)/gm
  }) as any,

  getFilePath () {

    const filePath = JS.getFilePath ();

    if ( !filePath ) return;

    return filePath.replace ( /\.js$/, '.d.ts' );

  },

  transform () {

    const filePath = DTS.getFilePath ();

    if ( !filePath || !Utils.file.exists ( filePath ) ) Utils.exit ( 'Entry file not found' );

    let content = Utils.file.read ( filePath );

    const exportAllNr = matches ( content, DTS.re.exportAll ).length,
          exportDefaultNr = matches ( content, DTS.re.exportDefault ).length,
          exportEqualsNr = matches ( content, DTS.re.exportEquals ).length,
          exportMultiNr = matches ( content, DTS.re.exportMulti ).length,
          exportOtherNr = matches ( content, DTS.re.exportOther ).length;

    if ( exportDefaultNr > 1 ) Utils.exit ( 'Multiple default exports found' );

    if ( exportDefaultNr === 1 ) {

      if ( exportAllNr || exportEqualsNr || exportMultiNr || exportOtherNr ) Utils.exit ( 'Unsupported export' );

      let namespace;

      for ( let i = 1;; i++ ) {
        const name = `${_.repeat ( '_', i )}default`;
        if ( content.includes ( name ) ) continue;
        namespace = name;
        break;
      }

      const indentation = detectIndent ( content ).indent || Config.indentation,
            exportName = DTS.re.exportDefault.exec ( content )[1],
            exportLines = [
              `declare const ${namespace}: typeof ${exportName} & {`,
              `${indentation}default: typeof ${exportName};`,
              `}`,
              `declare namespace ${namespace} {`,
              `${indentation}export type type = ${exportName};`,
              `}`,
              `export = ${namespace};`
            ];

      content = content.replace ( DTS.re.exportDefault, exportLines.join ( '\n' ) );

      Utils.file.write ( filePath, content );

    }

  }

};

/* EXPORT */

export default DTS;
