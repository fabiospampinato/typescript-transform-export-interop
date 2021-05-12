#!/usr/bin/env node

/* IMPORT */

import {program, updater} from 'specialist';
import {name, version} from '../../package.json';
import transform from '..';

/* MAIN */

updater ({ name, version });

program
  .name ( name )
  .version ( version )
  .arguments ( '[entryfile]' )
  .action ( transform );

program.parse ();
