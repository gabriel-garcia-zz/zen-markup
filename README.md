zen-markup: a zen-coding (sort of) clone for Javascript
=======================================================

This library operates with a simple way of expressing markup, very similar to the one used by [zen-coding](http://code.google.com/p/zen-coding/).
With it you can either generate DOM elements or HTML in an easy and compact way.


Objects
-------

* ZenMarkup(*input*) - Returns a ZenMarkup parser object. In order to retrieve the elements found in *input* call its parse() method.

* ZenHTML(*input*) - Returns a string containing the resulting HTML markup from parsing *input*

* ZenDOM(*input*) - Returns an array of DOM elements that were found on *input*

Silly usage examples
--------------------

    > ZenHTML('#wrapper > p.class1 + p.class2 + p.class3 > span[title="hello zen-markup!"]');
    < "<div id="wrapper"><p class="class1"><span title="hello zen-markup!"></span></p><p class="class2"><span title="hello zen-markup!"></span></p><p class="class3"><span title="hello zen-markup!"></span></p></div>"
    
    > ZenDOM('ul#my-list > li.elem + li.elem')
    < [<ul id="my-list">        ]
         <li class="elem"></li>
         <li class="elem"></li>
       </ul>
