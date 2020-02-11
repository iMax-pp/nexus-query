/* eslint-env browser */

function deleteConfig(groupId, artifactId, extension) {
  'use strict';

  const req = new XMLHttpRequest();
  req.addEventListener('load', () => {
    window.location = req.responseURL;
  });
  req.open('DELETE', `/config/${groupId}.${artifactId}.${extension}`);
  req.send();
}
