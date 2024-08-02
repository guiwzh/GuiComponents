import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fas } from '@fortawesome/free-solid-svg-icons'
// import './styles/index.scss'

// library.add(fas)

// export { default as Button } from './components/Button'
// export { default as Menu } from './components/Menu'
// export { default as AutoComplete } from './components/AutoComplete'
// export { default as Icon } from './components/Icon'
// export { default as Input } from './components/Input'
// export { default as Progress } from './components/Progress'
// export { default as Transition } from './components/Transition'
// export { default as Upload } from './components/Upload'