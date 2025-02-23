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

export default function rpcWorkerLoader (content) {
  return `import { expose } from 'comlink';
  ${content};
  self.onconnect = function (event) {
    const port = event.ports[0];
    expose(
      Object.keys(__webpack_exports__).reduce(function(r,k){
        if (k=='__esModule') return r;
        r[k] = __webpack_exports__[k];
        return r
      }, {})
    , port);
  };`;
}
