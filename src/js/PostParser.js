import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import cpp from 'highlight.js/lib/languages/cpp';
import 'highlight.js/styles/atom-one-light.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('cpp', cpp);

let referenceCounter = 1;
let references = [];

export function parsePost(api_url, text) {
    referenceCounter = 1;
    references = [];
    const code = [...text.matchAll(/```(\w+)[\n|\s](.+?)```\n{0,1}/gims)];
    for (const x of code) {
        let newCode = `<pre class='${/\n/.exec(x[0]) ? '' : 'inline-code'} code ${x[1]}'><code class='${
            /\n/.exec(x[0]) ? '' : 'inline-code'
        } hljs'>${hljs.highlight(x[2], { language: x[1] }).value}</code></pre>`;
        text = text.replace(x[0], newCode.replaceAll('\n', '&keepbreak'));
    }

    const variables = [...text.matchAll(/@\[(.*?)\]@/g)];
    const resultText = [];
    let i = 0;
    let index = 0;

    while (i !== text.length) {
        if (index !== variables.length) {
            if (variables[index].index === i) {
                resultText.push(parseJsonText(variables[index][0], variables[index][1]));
                i += variables[index][0].length;
                index++;
            } else {
                resultText.push(text.substr(i, variables[index].index - i));
                i = variables[index].index;
            }
        } else {
            resultText.push(text.substr(i));
            i = text.length;
        }
    }
    // replaceAll(/([^>]\n)/g, function ($0, $1) {return $1+'<br>'} could just have been replaceAll(/(?<!>)\n/g, '<br>') if safari supported negative lookbehinds
    return {
        references: references,
        text: resultText
            .join('')
            .replaceAll(/([^>]\n)/g, function ($0, $1) {
                return $1 + '<br>';
            })
            .replaceAll('&keepbreak', '\n')
    };
}

function parseJsonText(totalText, variable, api_url) {
    try {
        variable = JSON.parse(variable);
    } catch {
        return '';
    }
    if (variable !== 'undefined' && variable.type) {
        switch (variable.type) {
            case 'img':
                return imgParser(variable, api_url);
            case 'reference':
                return referenceParser(variable);
        }
    }
    return '';
}

function imgParser(variable, api_url) {
    let text = `<div style='display:grid'><img class='img-img' src='${api_url}${variable.src}' alt='${variable.alt}' "></img>`;
    if ('text' in variable) {
        text += `<div class='img-text'>${variable.text}</div>`;
    }
    text += `</div>`;
    return text;
}

function referenceParser(variable) {
    if ('text' in variable) {
        references.push({ count: referenceCounter, text: variable['text'] });
    }
    return `<a href='#ref_${referenceCounter}_bot'><sup id='ref_${referenceCounter}_top'>[${referenceCounter++}]</sup></a>`;
}
