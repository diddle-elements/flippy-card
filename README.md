# \<flip-card\>

A Flippable &#34;card&#34; based on Paul Lewis&#39; experiment

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/owner/my-element)

## Installation
1. Install bower per their instructions, such as via:
    ```
    npm install -g bower
    ```
1. Using bower install the package to your project
    ```
    cd $YOUR_PROJECT_DIR
    bower install diddledan/flippy-card
    ```

You will now find a folder called bower_components in your project root which contains the webcomponents polyfill, and the validate-string element files along with any dependencies required.

## Usage

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="flippy-card.html">
    <link rel="import" href="../paper-button/paper-button.html">
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
* [Paul Lewis (aerotwist)](https://github.com/paullewis/) [Paul's Homepage](https://aerotwist.com/)
* [Daniel Llewellyn (diddledan)](https://github.com/diddledan/)

## License
MIT License

See the `LICENSE` file in the root folder of this package.