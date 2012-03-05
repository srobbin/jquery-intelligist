/*
 * Intelligist
 * Version 1.0.1
 * http://srobbin.com/jquery-plugins/intelligist/
 *
 * a jQuery plugin that makes it easy to share multiple, executable GitHub gists
 *
 * Copyright (c) 2012 Scott Robbin (srobbin.com)
 * Licensed under the MIT license.
*/

;(function($){
    
    $.fn.intelligist = function( gists, options ){
        // If we passed in too few elements
        if( this.length == 0 || $.isEmptyObject(gists) ) return;
                
        var $el = $(this[0]) // Only apply to one element
          , $body = $('body')
          , $gist = $('<div />').appendTo( $el )
          , $sandbox = $('<div />').appendTo( $el ).css({ position: 'absolute', left: -999999 })
          , gistCount = ( $.map(gists, function(id) { return id; }) ).length
          , selectedGist;
          
        // Default settings
        var settings = {
            exec: false                                 // Should we execute the gist after it's loaded?
          , before: function( oldGistId, newGistId ) {}   // Function to execute before gist is loaded
          , after: function( newGistId ) {}               // Function to execute after gist is loaded
        }
                
        // Extend the settings with those the user has provided
        if(options && typeof options == 'object') $.extend(settings, options);
                
        // If jQuery Chosen isn't available, download it
        if( !('chosen' in $.fn) && gistCount > 1 ) {
            var chosenScript = 'http://srobbin.github.com/chosen/chosen.jquery.min.js'
              , chosenCSS = 'http://srobbin.github.com/chosen/chosen.css';
            
            // Fetch Chosen's script and styles
            $('<link />').attr({
                rel: 'stylesheet'
              , type: 'text/css'
              , href: chosenCSS
            }).appendTo( $el );
            $.getScript(chosenScript, _init);
        } else {
            _init();
        }
        
        // Init
        function _init() {
            
            $(document).ready(function() {
                var selectStyles = { marginBottom: 20, width: '100%' };
                
                $select = $('<select />').css(selectStyles);
                $.each(gists, function( gistId, title) {
                    $('<option />').val( gistId )
                                   .text( title )
                                   .appendTo( $select );
                });
                
                // Create the chosen dropdown
                if( gistCount > 1 ) {
                    $select.prependTo( $el )
                           .chosen()
                           .change(function() { _loadGist( $(this).val() ); })
                           .next('.chzn-container').css(selectStyles)
                           .find('.chzn-drop').css({ 
                               'width': '100%'
                             , '-moz-box-sizing': 'border-box'
                             , '-ms-box-sizing': 'border-box'
                             , 'box-sizing': 'border-box'
                            }).end()
                           .find('.chzn-search input').css({ width: '95%' });                    
                }

                // Load the selected gist
                _loadGist( $select.val() );
            });          
        }
        
        function _loadGist( gistId ) {
            var embedUrl = 'https://gist.github.com/' + gistId + '.js'
            
            // Execute the before method
            settings.before(selectedGist, gistId);
            selectedGist = gistId;
        
            // Temporarily override document.write
            document._write = document.write;
            document.write = function(str) { $gist.append(str); };
            
            // Replace the gist content
            $gist.height( $gist.height() ).empty();
            $.getScript( embedUrl, function() {    
                // Remove document.write override
                document.write = document._write;
                
                // Allow the height to be auto
                $gist.height('auto');
                
                // Should we execute this code?
                if( settings.exec ) {                    
                    // Determine the file type by the raw file suffix
                    var $raw = $gist.find('a[href^="https://gist.github.com/raw/"]')
                      , href = $raw.attr('href')
                      , suffix = href.split('.').pop()
                      , cleaner = /[^A-Za-z 0-9\"\.,\?''!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g
                      , $code = $gist.find('.gist-data');
                        
                    // Fetch and clean the gist
                    var gist = $.map( $code.find('.line'), function (line) {
                        // Strip out HTML and non-ascii characters
                        line = $(line).text();
                        return line.replace(cleaner, '');
                    });
                    gist = gist.join('\n');
                    
                    // What to do?
                    switch( suffix ) {
                        case 'js':
                            eval(gist);
                            break;
                        case 'css':
                            // Strip the non-ascii characters first
                            $sandbox.html( $('<style>' + gist + '</style>') );
                            break;
                        default:
                            $sandbox.html( gist );
                            break;
                    }
                    
                    // Execute the after method
                    settings.after(gistId);
                }
            });
        }
        
    };
})(jQuery);