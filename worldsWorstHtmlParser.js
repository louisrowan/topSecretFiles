'use strict';

const Fs = require('fs');
const Path = require('path');

const validElements = [
    'a',
    'body',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'html',
    'li',
    'ol',
    'p',
    'span',
    'table',
    'tbody',
    'th',
    'td',
    'tr',
    'ul'
];


function htmlElement (tagName) {

    this.tagName = tagName;
    this.id = null;
    this.classNames = [];
    this.children = [];
    this.innerHtml = null;
}



function htmlParse () {

    this.ishtmlParse = true;
    this.elements = [];
};


const stateMap = {
    0: null,
    1: 'openTag',
    2: 'innerHtml',
    3: 'closeTag'
}


htmlParse.prototype.load = function (rawInput) {

    const html = rawInput;

    const stack = [];
    const currentEl = () => stack.length ? stack[stack.length - 1] : null;
    let state = null;
    let currentInnerHtml = '';

    for (let i = 0; i < html.length; ++i) {

        if (html[i] === '<') {
            const possibleStartTag = html.substr(i, i + 10).match(/^<[a-zA-z1-6]+/g) || [];
            const possibleEndTag = html.substr(i, i + 10).match(/^<\/[a-zA-z1-6]+/g) || [];

            // possible start open tag
            if (possibleStartTag[0]) {
                const startTag = possibleStartTag[0].substr(1, possibleStartTag[0].length - 1);
                if (validElements.includes(startTag)) {

                    /// start tag open confirmed
                    // console.log()
                    // console.log()
                    // console.log('inner html from open start tag:')
                    // console.log(currentInnerHtml)
                    currentInnerHtml = '';
                    state = 1;
                    const newElement = new htmlElement(startTag);
                    if (currentEl()) {
                        currentEl().children.push(newElement);
                    }
                    stack.push(newElement)
                    this.elements.push(newElement)
                    // console.log('')
                    // console.log('new element:', currentEl().tagName)
                }
            }

            // possible start close tag
            if (possibleEndTag[0]) {
                const endTag = possibleEndTag[0].substr(2, possibleEndTag[0].length - 1);
                if (stack[stack.length - 1].tagName === endTag) {

                    // end tag open confirmed
                    // console.log()
                    // console.log()
                    // console.log('inner html from close start tag:')
                    // console.log(currentInnerHtml);
                    stack.pop().innerHtml = currentInnerHtml;
                    currentInnerHtml = '';
                    state = 3;
                }
            }
        }


        if (state === 2) {
            currentInnerHtml += html[i];
        }


        // check for id
        console.log('sup', html.substr(i, i + 2))
        if (state === 1 && html.substr(i, i + 2).toLowerCase() === 'id=') {
            console.log('in here and found id thing')
            const possibleId = html.substr(i + 3, i + 50).match(/^s+/g) || [];
            const id = possibleId[0];
            console.log('id?', id)
        }



        // close open tag
        if (state === 1 && html[i] === '>') {
            // console.log('closing open tag for', currentEl().tagName)
            state = 2;
        }



    }

    return this;
}







const r = Fs.readFileSync(Path.resolve(__dirname, './sample2.html')).toString();

const myHtml = new htmlParse();
const hello = myHtml.load(r)
console.log()
console.log()
console.log()
console.log(hello.elements)
