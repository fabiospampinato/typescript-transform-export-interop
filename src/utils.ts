
/* IMPORT */

import * as _ from 'lodash';
import * as fs from 'fs';
import chalk from 'chalk';

/* UTILS */

const Utils = {

  exit ( msg ) {

    console.error ( chalk.red ( `[typescript-transform-export-interop] ${msg}` ) );

    process.exit ( 1 );

  },

  parseRe ( re ) {

    return _.reduce ( re, ( acc, re, key ) => {
      acc[key] = new RegExp ( re.source.replace ( / +/g, '\\s*' ), re.flags );
      return acc;
    }, {} );

  },

  file: {

    exists ( filePath ) {

      return fs.existsSync ( filePath );

    },

    read ( filePath ) {

      return fs.readFileSync ( filePath, { encoding: 'utf8' } );

    },

    write ( filePath, content ) {

      return fs.writeFileSync ( filePath, content );

    }

  }

};

/* EXPORT */

export default Utils;
