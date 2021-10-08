import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('php', php);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

import 'highlight.js/styles/atom-one-light.css'
import { API_PROTOCOL, API_SERVER } from './apiConfig';

let referenceCounter = 1;
let references = [];

export function parsePost (text) {
	referenceCounter = 1;
	references = [];
	const code = [...text.matchAll(/```(\w+)[\n|\s](.+?)```\n{0,1}/gmis)]
	for (const x of code) {
		const newCode = document.createElement('div');
		if (/\n/.exec(x[0])) {
			newCode.innerHTML = `<pre class="code ${x[1]}"><code>${replace_illegal_characters(x[2])}</code></pre>`
		} else {
			newCode.innerHTML = `<pre class="code inline ${x[1]}"><code>${x[2]}</code></pre>`
		}
		hljs.highlightElement(newCode.firstElementChild);
		text = text.replace(x[0], newCode.innerHTML.replaceAll('\n', '&keepbreak'))
	}

	const variables = [...text.matchAll(/@\[(.*?)\]@/g)]
	const resultText = []
	let i = 0
	let index = 0

	while (i !== text.length) {
		if (index !== variables.length) {
			if (variables[index].index === i) {
				resultText.push(parseJsonText(variables[index][0], variables[index][1]),)
				i += variables[index][0].length
				index++
			} else {
				resultText.push(text.substr(i, variables[index].index - i))
				i = variables[index].index
			}
		} else {
			resultText.push(text.substr(i))
			i = text.length
		}
	}
	return {'references': references, 'text': resultText.join('').replaceAll(/(?<!>)\n/g, '<br>').replaceAll('&keepbreak', '\n')}
}

function parseJsonText (totalText, variable) {
	try {
		variable = JSON.parse(variable)
	} catch {
		return ''
	}
	if (variable !== 'undefined' && variable.type) {
		switch (variable.type) {
			case 'img':
				return imgParser(variable)
			case 'reference':
				return referenceParser(variable);
		}
	}
	return ''
}

function imgParser (variable) {
	let text = `<div style='display:grid'><img src="${API_PROTOCOL}${API_SERVER}${variable.src}" alt="${variable.alt}" "></img>`
	if ('text' in variable) {
		text += `<div class="img-text">${variable.text}</div>`
	}
	text += `</div>`
	return text
}

function replace_illegal_characters(str) {
	return str.replaceAll('<', '&lt').replaceAll('>', '&gt');
}

function referenceParser(variable) {
	if ('text' in variable) {
		references.push({ 'count': referenceCounter, 'text': variable['text'] });
	}
	return `<a href="#ref_${referenceCounter}_bot"><sup id="ref_${referenceCounter}_top">[${referenceCounter++}]</sup></a>`;

}
