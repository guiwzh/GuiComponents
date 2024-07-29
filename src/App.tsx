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
import Upload from './components/Upload/upload';
library.add(fas)

function App() {
  const renderOption = (item:DataSourceType) => {
    return (<>
      <div>{item.value}</div>
      <div>{item.label}</div>
      </>
    )
  }
  const handleFetch = (str:string) => {

    // if(str==="a"){
    //   return new Promise <DataSourceType[]>(resolve => {
    //     setTimeout(() => resolve([{value:'a1'},{value:'a2'},{value:'a3'}] as DataSourceType[]),5000)
    //   })
    // }
    // if(str==="ab"){
    //   return new Promise<DataSourceType[]>(resolve => {
    //     setTimeout(() => resolve([{value:'a1'}] ) ,2000)
    //   })
    // }
    return fetch(`https://api.github.com/search/users?q=${str}`)
      .then(res => res.json())
      .then(res => {
        return res.items.map((item: { login: any,id:string; })=> ({value:item.login, label:item.id })).slice(0,10)
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
          // onEnterDown={(item)=>console.log(1,item)}
          style={{width: '200px'}}>
        </AutoComplete>
        <Upload 
          action={"https://jsonplaceholder.typicode.com/posts/"}
          onprogress={()=>console.log(1)}
          onSuccess={()=>console.log(2)}
          onError={(err)=>console.log(err)}
        ></Upload>

      </header>
    </div>
  );
}

export default App;
