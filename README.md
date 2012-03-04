# Intelligist

a jQuery plugin that makes it easy to share multiple, executable GitHub gists

## Demo

[See Intelligist in action](http://srobbin.com/jquery-plugins/intelligist/)

## Requirements

[jQuery](http://jquery.com)
[Chosen](http://harvesthq.github.com/chosen/) (optional, it is auto-downloaded if not already included on the page)

## How to use

Using Intelligist is easy. The general idea is:

    $(selector).intelligist( gists, options );

Just select the container, and pass in an object of gists that you'd like to display.

    $("#demo").intelligist({
          "1973984": "Welcome to Intelligist"
        , "1973990": "Live CSS preview"
        , "1973575": "Live JS preview"
    }, { exec: true });

The object is made of keys (the gist ID) and values (titles for the drop-down menu).

*Note: In this example, we are setting the "exec" option to true. This instructs Intelligist to execute the code after the gist is displayed. It is optional, and disabled by default.*

*Important: If you are using the "exec" option, your Gist must be set to the correct language. Intelligist uses the Gist language to determine how it should execute the code.*

## Options

### exec

Should the gist be executed after it is loaded onto the page? *Note: If you are using this option, your Gist must be set to the correct language (e.g. CSS or JavaScript)* (default=false)

### before

A function to be called before the gist is loaded onto the page. It is passed two variables, the ID of the previous gist and the ID of the newly selected gist. e.g. function(oldGistId, newGistId) {}

### after 

A function to be called after the gist is loaded onto the page. It is passed one variable, the ID of the newly selected gist. e.g. function(newGistId) {}

## Thank yous

* GitHub: for creating the [Gists service](https://gist.github.com/)
* [Harvest](http://www.getharvest.com/): for creating [Chosen](http://harvesthq.github.com/chosen/)
* Martin Angelov: whose [Shuffle Letters](http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/) plugin is being used in the demo
