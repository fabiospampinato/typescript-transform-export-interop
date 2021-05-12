
/* IMPORT */

import * as fs from 'fs';
import {color} from 'specialist';

/* UTILS */

const Utils = {

  exit ( msg ) {

    console.error ( color.red ( `[typescript-transform-export-interop] ${msg}` ) );

    process.exit ( 1 );

  },

  parseRe ( re ) {

    for ( const key in re ) {
      const value = re[key];
      re[key] = new RegExp ( value.source.replace ( / +/g, '\\s*' ), value.flags );
    }

    return re;

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
