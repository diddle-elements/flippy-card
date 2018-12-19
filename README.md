# \<flippy-card\>

A Flippable &#34;card&#34; based on Paul Lewis&#39; [UI Experiment](https://github.com/GoogleChrome/ui-element-samples/tree/gh-pages/3d-card-flip)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)

## Installation

1. Using npm install the package to your project
    ```bash
    cd $YOUR_PROJECT_DIR
    npm install --save @diddledan/flippy-card
    ```

You will now find a folder called node_modules in your project root which contains the webcomponents polyfill, and the flippy-card element files along with any dependencies required.

## Usage

<!--
```
<custom-element-demo>
  <template>
    <script type="module" src="flippy-card.js"></script>
    <script type="module" src="../paper-button/paper-button.html"></script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<flippy-card id="thecard" axis="Y" current-side='front'>
    <div slot="front">
        This is the Front
        <paper-button onclick='flipit'>FLIP IT!</paper-button>
    </div>
    <div slot="back">
        This is the Back<br/>MoreContent<br/>Expando Divboxus!
        <paper-button onclick='flipit'>Flip it again, Sam!</paper-button>
    </div>
</flippy-card>
<script type="javascript">
function flipit() {
    document.getElementById('thecard').flip();
}
</script>
```

## Contributing

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :D

## Credits

* [Paul Lewis (aerotwist)](https://github.com/paullewis/) ([Paul's Homepage](https://aerotwist.com/))
* [Daniel Llewellyn (diddledan)](https://github.com/diddledan/)

## License

MIT License

See the `LICENSE` file in the root folder of this package.