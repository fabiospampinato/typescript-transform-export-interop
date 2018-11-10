
/* IMPORT */

import * as Caporal from 'caporal';
import * as readPkg from 'read-pkg-up';
import * as updateNotifier from 'update-notifier';
import transform from '.';

const caporal = Caporal as any;

/* CLI */

async function CLI () {

  /* APP */

  const {pkg} = await readPkg ({ cwd: __dirname });

  updateNotifier ({ pkg }).notify ();

  const app = caporal.version ( pkg.version );

  /* COMMAND */

  app.argument ( '[path]', 'Path to the entry file' )
     .action ( transform );

  /* PARSE */

  caporal.parse ( process.argv );

}

/* EXPORT */

export default CLI;
