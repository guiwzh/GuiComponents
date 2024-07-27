import React from 'react';
import Button from './components/Button/button';
import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Icon from './components/Icon/icon';
import Input from './components/Input/input';
import AutoComplete, { DataSourceType } from './components/AutoComplete/Autocomplete';
library.add(fas)

function App() {
  const renderOption = (item:DataSourceType) => {
    return (<>
      <div>{item.value}</div>
      </>
    )
  }
  const handleFetch = (str:string) => {
    return fetch(`https://api.github.com/search/users?q=${str}`)
      .then(res => res.json())
      .then(res => {
        return res.items.map((item: { login: any; })=> ({ value: item.login }))
      })
  }
  return (
    <div className="App">
      <Icon icon="arrow-down" theme='danger' size='lg'></Icon>
      <header className="App-header">
        <Button btnType='primary'>Heello</Button>
        <Menu defaultIndex='0' onSelect={(e,index) => console.log(e,index)} mode="vertical">
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
        <Input  defaultValue={['asd','sadsd']}></Input>
        <AutoComplete fetchSuggestions={handleFetch}
        renderOption={renderOption}
        ></AutoComplete>
      </header>
    </div>
  );
}

export default App;
