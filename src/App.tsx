import React from 'react';
import Button from './components/Button/button';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Icon from './components/Icon/icon';
library.add(fas)


function App() {
  return (
    <div className="App">
      <Icon icon="arrow-down" theme='danger' size='lg'></Icon>
      <header className="App-header">
        <Button btnType='primary'>Heello</Button>
        <Menu defaultIndex='0' onSelect={(e,index) => console.log(e,index)} >
          <MenuItem>link1</MenuItem>
          <MenuItem>link2</MenuItem>
          <SubMenu title='子菜单'>
          <MenuItem>
              link3
          </MenuItem>
          <SubMenu title='子菜单2'>
            <MenuItem>link4</MenuItem>
          </SubMenu>
          <MenuItem>link5</MenuItem>
          </SubMenu>
        </Menu>
      </header>
    </div>
  );
}

export default App;
