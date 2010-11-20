var ZenMarkup = function(input) {
    return {
        data: input.replace(/\s/g, ''),
        curr_index: 0,

        peekChar: function() { return this.data[this.curr_index]; },
        getChar: function() { return this.data[++this.curr_index]; },

        readWord: function(word_ptn) {
            var c = null;
            var word = '';
            word_ptn = word_ptn || /\w/;

            while (c = this.peekChar()) {
                if (word_ptn.test(c)) {
                    word += c;
                    this.getChar();
                } else {
                    break;
                }
            }

            return word;
        },

        readModifier: function() {
            this.getChar();
            return this.readWord();
        },

        readAttributeValue: function() {
            var first = this.getChar();

            if (first == '"' || first == "'") {
                var value = first;

                while (true) {
                    var c = this.getChar();

                    if (c == first) {
                        this.getChar();
                        break;
                    } else {
                        value += c;
                    }
                }

                return value.substr(1, value.length - 1);

            } else {
                return this.readWord();
            }
        },

        readAttributes: function() {
            var attribs = {};

            while (true) {
                var attrname = this.readWord();
                var c = this.peekChar();

                if (c == '=') {
                    var value = this.readAttributeValue();
                    attribs[attrname] = value;
                } else {
                    this.getChar();

                    if (attrname) attribs[attrname] = false;

                    if (c == ']') break;
                }
            }

            return attribs;
        },

        readElement: function() {
            var c = null;
            var elem = { name: this.readWord(),
                         attributes: {},
                         classes: [],
                         children: [] };

            while (c = this.peekChar()) {
                if (c == '#') {
                    elem.attributes.id = this.readModifier();
                } else if (c == '.') {
                    elem.classes.push(this.readModifier());
                } else if (c == '[') {
                    this.getChar();
                    var attribs = this.readAttributes();
                    for (attrname in attribs) {
                        elem.attributes[attrname] = attribs[attrname];
                    }
                } else {
                    break;
                }
            }

            return elem;
        },

        parse: function() {
            var c, first, elem;
            var current = [];

            while (c = this.peekChar()) {
                if (/\w/.test(c) && !elem) {
                    first = elem = [this.readElement()];
                } else if (c == '>' || c == '+') {
                    if (!elem) throw 'There\'re no parents for this child.'

                    this.getChar();
                    var new_elem = this.readElement();

                    if (c == '+') {
                        if (current.length > 0) {
                            current.push(new_elem);
                        } else {
                            elem.push(new_elem);
                        }
                    } else {
                        if (current.length < 1) {
                            current.push(new_elem);
                        } else {
                            elem = current;
                            current = [new_elem];
                        }

                    }

                    for (var i=0; i<elem.length; i++) elem[i].children = current;
                } else {
                    throw 'Didn\'t expect character "'+c+'".'
                }
            }

            return first;
        }
    };
};

var ZenRenderer = function(input) {
    var renderer = {
        renderAttributes: function(attribs) {
            ret = [];

            for (attrname in attribs) {
                var value = attribs[attrname] ?
                    '="'+attribs[attrname]+'"' : '';
                ret.push(attrname+value);
            }

            return ret.join(' ');
        },

        renderClasses: function(classes) {
            return classes.length > 0 ? 'class="'+classes.join(' ')+'"' : '';
        },

        render: function(elems) {
            var self = this;
            var ret = "";

            for (var i=0; i<elems.length; i++) {
                var elem = elems[i];
                var attribs = self.renderAttributes(elem.attributes);
                var classes = self.renderClasses(elem.classes);
                ret += "<!NAME!CLASSES!ATTRIBS>".
                    replace(/!NAME/, elem.name).
                    replace(/!CLASSES/, classes ? ' '+classes : '').
                    replace(/!ATTRIBS/, attribs ? ' '+attribs : '');
                
                ret += self.render(elem.children);
                ret += "</"+elem.name+">";
            }

            return ret;
        }

    };

    var elems = new ZenMarkup(input).parse();

    return renderer.render(elems);
};

var ZenDOM = function(input) {
    var elemsToDOM = function(elems) {
        var ret = [];

        for (var i=0; i<elems.length; i++) {
            var elem = elems[i];
            var dom_elem = document.createElement(elem.name);

            for (attrname in elem.attributes) {
                dom_elem.setAttribute(attrname, elem.attributes[attrname]);
            }

            if (elem.classes.length > 0) {
                dom_elem.setAttribute('class', elem.classes.join(' '));
            }

            var children = elemsToDOM(elem.children);
            for (var ci=0; ci<children.length; ci++) {
                dom_elem.appendChild(children[ci]);
            }
                
            ret.push(dom_elem);
        }

        return ret;
    };

    var elems = new ZenMarkup(input).parse();

    return elemsToDOM(elems);
};

