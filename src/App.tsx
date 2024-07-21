import React from 'react';
import Button from './components/Button/button';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button btnType='primary'>Heello</Button>

        <Menu defaultIndex='0' onSelect={index => console.log(index)}>
          <MenuItem>link1</MenuItem>
          <MenuItem>link2</MenuItem>
          <SubMenu title='子菜单'>
          <MenuItem>
          {/* <SubMenu title='子菜单2'>
            <MenuItem>link3</MenuItem>
          </SubMenu> */}
            
            </MenuItem>
          <MenuItem>link2</MenuItem>
          </SubMenu>
        </Menu>
      </header>
    </div>
  );
}

export default App;
