
/* IMPORT */

import transformers from './transformers';

/* TRANSFORM */

function transform () {

  for ( let transformer of transformers ) {

    transformer.transform ();

  }

}

/* EXPORT */

export default transform;
