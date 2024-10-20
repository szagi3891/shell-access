
import React from "react";
import ReactDOM from "react-dom";
// import {
//     BrowserRouter as Router,
//     Link,
//     Route,
//     Switch,
// } from "https://esm.sh/react-router-dom@5.2.0";

import { timeout } from '@reactive/utils';

const main = () => {
    (async () => {
        console.info('hello');
        await timeout(1000);
        console.info('world');
    })();

    //TODO - odpalenie połączenia socketowego do 127.0.0.1/ws --- jakiś port

    function App() {
        return (
            <div>
                <nav>
                    <ul>
                        <li>
                            aaa
                        </li>
                        <li>
                            bbb
                        </li>
                        <li>
                            ccc
                        </li>
                    </ul>
                </nav>

                {
                /* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */
                }
            </div>
        );
    }

    const render = () => {
        ReactDOM.render(React.createElement(App), document.querySelector("#main"));
    }

    addEventListener("DOMContentLoaded", () => {
        render();
    });
};

main();