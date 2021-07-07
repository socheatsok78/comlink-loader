/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import path from 'path';
import loaderUtils from 'loader-utils';
import slash from 'slash';

const comlinkLoaderSpecificOptions = [
  'multiple', 'multi' // @todo: remove these
];

export default function loader () { }

loader.pitch = function (request) {
  const options = loaderUtils.getOptions(this) || {};
  const workerLoaderOptions = {
    options: {
      worker: 'SharedWorker'
    }
  };
  for (let i in options) {
    if (comlinkLoaderSpecificOptions.indexOf(i) === -1) {
      workerLoaderOptions[i] = options[i];
    }
  }

  const workerLoader = `!worker-loader?${JSON.stringify(workerLoaderOptions)}!${slash(path.resolve(__dirname, 'comlink-worker-loader.js'))}`;

  const remainingRequest = JSON.stringify(workerLoader + '!' + request);

  return `
    var wrap = require('comlink').wrap,
        SharedWorker = require(${remainingRequest}),
        inst;
    module.exports = function f() {
      var worker = SharedWorker()
      if (this instanceof f) return wrap();
      return inst || (inst = wrap(SharedWorker()));
    };
  `.replace(/\n\s*/g, '');
};
