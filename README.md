# ling-doc-plus

This app should help you gen like `A4 Doc` form page.

## how to use

1. load ifarme page;

```html
<iframe
  class="if"
  id="LING_DOC_APP"
  src="http://localhost:5173/"
  allow="fullscreen"
  width="100%"
  height="100%"
></iframe>
```

2. get app

```js
const lingApp = document.querySelector("#LING_DOC_APP");

lingApp.onload = () => {
  const app = lingApp.contentWindow.LingApp;
};
```

## methods

1. init

> init app with some config

|name|type|example|desc|
|--|--|--|--|
|design|boolean|false|doc design status|
|buttons|Array|[{type: "danger", text: "清空数据", method: function() ]|top option buttons|

2. loadComponents

import doc components array

3. saveComponents

return doc components array

4. loadData

5. saveData

6. clearData
