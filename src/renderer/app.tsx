import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import Application from './components/Application';
import store from './store';
import { WordFormReader } from "../main/WordFormReader";
import { Optional } from "typescript-optional";
import { EPubBookReader } from "../main/EPubBookReader";
import { EBookReadAgent } from "../main/EBookReadAgent";

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

async function test() {
  EBookReadAgent.register("epub", EPubBookReader);
  const contents = await EBookReadAgent.readAll("/home/searene/Documents/books/Martin Kleppmann-Designing Data-Intensive Applications_ The Big Ideas Behind Reliable, Scalable, and Maintainable Systems-O’Reilly Media (2017).epub");
  if (contents.isPresent()) {
    console.log(contents);
  } else {
    console.log("empty");
  }
}
test();

// Render components
const render = (Component: () => JSX.Element) => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
        mainElement
    );
};

render(Application);
