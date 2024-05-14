/**
 * The function `createElementFromJSON` creates DOM elements based on a JSON structure and appends them
 * to a specified parent element.
 * @param jsonStructure - The `jsonStructure` parameter is an object that represents the structure of
 * an HTML element. It has the following properties:
 * @param [parent] - The `parent` parameter in the `createElementFromJSON` function is the parent
 * element to which the created DOM element will be appended. If no parent is specified, the default
 * parent element is `document.body`, which means the created element will be appended to the body of
 * the HTML document. You can
 * @returns The `domElement` that was created and appended to the `parent` element is being returned by
 * the `createElementFromJSON` function.
 */
function createElementFromJSON(jsonStructure, parent = document.body) {
    const { tag, attrs = {}, children = [] } = jsonStructure;
    const domElement = document.createElement(tag);

    Object.keys(attrs).forEach(attr => {
        domElement.setAttribute(attr, attrs[attr]);
    });

    children.forEach(child => {
        if (typeof child === 'object') {
            domElement.appendChild(this.createElementFromJSON(child));
        } else {
            domElement.appendChild(document.createTextNode(child));
        }
    });

    parent.appendChild(domElement);

    return domElement;
}

/**
 * The `createElement` function in JavaScript dynamically creates HTML elements with specified
 * attributes and children, including support for event listeners.
 * @param tagName - The `tagName` parameter in the `createElement` function represents the type of HTML
 * element you want to create. For example, if you want to create a `<div>` element, you would pass
 * `'div'` as the `tagName` parameter when calling the `createElement` function.
 * @param [attrs] - The `attrs` parameter in the `createElement` function is an object that contains
 * attributes to be set on the created element. These attributes can include standard HTML attributes
 * like `id`, `class`, `style`, etc., as well as event listeners prefixed with 'on' (e.g., `onClick
 * @param children - The `children` parameter in the `createElement` function represents the elements
 * or text nodes that will be appended as children to the created element. These can be passed as
 * individual arguments after the `attrs` object when calling the function. The `createElement`
 * function handles different types of children:
 * @returns The `createElement` function returns a newly created HTML element with the specified tag
 * name, attributes, and children nodes.
 */
function createElement(tagName, attrs = {}, ...children) {
    const element = document.createElement(tagName);

    for (const [attr, value] of Object.entries(attrs)) {
        if (attr.startsWith('on') && typeof value === 'function') {
            const eventName = attr.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else {
            element.setAttribute(attr, value);
        }
    }

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (Array.isArray(child)) {
            child.forEach(nestedChild => element.appendChild(nestedChild));
        } else if (child instanceof Node) {
            element.appendChild(child);
        } else {
            console.error("Invalid child type", child);
        }
    });

    return element;
}

/**
 * The function "on" attaches an event listener to a specified element in JavaScript.
 * @param element - The `element` parameter is the DOM element to which you want to attach the event
 * listener.
 * @param eventType - The `eventType` parameter specifies the type of event for which the event
 * listener is being added. Examples of event types include "click", "mouseover", "keydown", etc.
 * @param handler - The `handler` parameter in the `on` function is a function that will be called when
 * the specified `eventType` occurs on the `element`. This function is responsible for defining the
 * behavior or action that should be taken in response to the event.
 * @param [options=false] - The `options` parameter in the `addEventListener` method is an optional
 * parameter that specifies various characteristics of the event listener. It can be an object that
 * specifies whether the event listener should be passive, capture, or once.
 */
function on(element, eventType, handler, options = false) {
    element.addEventListener(eventType, handler, options);
}

/**
 * The render function appends a component to a specified mount node in JavaScript.
 * @param component - The `component` parameter is typically a DOM element or a virtual DOM element
 * that you want to render on the web page. It could be a div, a button, a paragraph, or any other HTML
 * element.
 * @param mountNode - The `mountNode` parameter is typically a reference to the HTML element where you
 * want to render the component. It is the DOM element to which you want to append the component.
 */
function render(component, mountNode) {
    mountNode.appendChild(component);
}

/**
 * The function `updateElement` replaces an old child element with a new child element within a
 * specified parent element.
 * @param parent - The `parent` parameter in the `updateElement` function refers to the element that
 * contains both the `newChild` and `oldChild` elements. It is the element to which the `newChild` will
 * be added and the `oldChild` will be replaced within the DOM.
 * @param newChild - The `newChild` parameter is the element that you want to replace the `oldChild`
 * with in the `parent` element.
 * @param oldChild - The `oldChild` parameter in the `updateElement` function represents the existing
 * child element that you want to replace within the `parent` element.
 */
function updateElement(parent, newChild, oldChild) {
    parent.replaceChild(newChild, oldChild);
}


/**
 * The `getAttribute` function retrieves the value of a specified attribute on a DOM element.
 * @param element - The DOM element from which you want to get the attribute value.
 * @param attributeName - The name of the attribute you want to get the value of.
 * @returns The value of the specified attribute on the DOM element, or `null` if the attribute is not found.
 */
function getAttribute(element, attributeName) {
    return element.getAttribute(attributeName);
}

/**
 * The `addAttribute` function adds a new attribute to a DOM element with a specified value.
 * @param element - The DOM element to which you want to add the attribute.
 * @param attributeName - The name of the attribute you want to add to the element.
 * @param attributeValue - The value of the attribute you want to set.
 */
function addAttribute(element, attributeName, attributeValue) {
    element.setAttribute(attributeName, attributeValue);
}


/* The `const MiniFrame` object is being created and initialized with properties that are references to
the functions defined in the JavaScript code snippet. These functions include `createElement`,
`createElementFromJSON`, `on`, `render`, and `updateElement`. By assigning these functions as
properties of the `MiniFrame` object, they can be easily accessed and used collectively as part of a
mini framework or library for creating and manipulating DOM elements in a web application. This
organization helps in modularizing the code and providing a convenient way to interact with these
functions as a cohesive unit. */
const MiniFrame = {
    createElement,
    createElementFromJSON,
    on,
    render,
    updateElement,
    getAttribute,
    addAttribute,
};




export { MiniFrame };