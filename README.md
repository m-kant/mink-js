mink-js
=======
It is a Java Script library, containing UI widgets and data manipulating functions, intended to use in mobile web apps or sites.
All widgets are independent and can be used regardless of all others, or can be combined in any way.

jquery.mk.pagex
---------------
Hash routing plugin based on _page_ or _screen_ paradigm. Allows on-fly ajax loading, caching of pages. Uses CSS animation.

jquery.mk.databridge
--------------------
jQuery plugin intended to read or apply data-objects to DOM through "name" or "data-name" attributes.

jquery.mk.modal
---------------
Modal window with CSS animation. It can create content with string, DOMElement or AJAX with corresponding syntax sugar.

mk.drawer
---------
Framework-agnostic UI Drawer element. 

mk.infopane
-----------
Framework-agnostic UI element. Stack of messages in bounded area with CSS animataion.

mk.localizer
------------
Way to add multilingual support into existing html markup. Uses XML property to keep text in a separate node.

mk.mixin.events
---------------
Mixing into any object ability to emit events.

mk.mixin.keep
-------------
Mixing into any object ability to store data objects.

mk.simplerender
---------------
Extremely fast and simple templates with %dataName% style.

mk.slidemenu
------------
Framework-agnostic mobile-style sliding lists.

mk.utils**
----------
Different utils used in some widgets, and usefull in practice.

Some genral ideas in project
----------------------------
* Loosely coupled architecture is excellent - modules must be as indpendent as possible. 
* Only CSS animation can be used. 
* Better to be standart, than to think different with API and usability.

Functions wich uses DOM elements as a point of origin are formatted as jQuery plugins, others can be used as framework-agnostic.

