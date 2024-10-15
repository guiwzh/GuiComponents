import React from "react";
import Button from "./components/Button/button";
import Menu, { MenuItem, SubMenu } from "./components/Menu";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Icon from "./components/Icon";
import Input from "./components/Input";

import AutoComplete, {
  DataSourceType,
} from "./components/AutoComplete/autoComplete";
import Upload from "./components/Upload/upload";
import VirtualList from "./components/VirtualList";
import LazyLoad from "./components/LazyLoad";
import img2 from "./img2.png";

import Guang from "./Guang";
import Signature from "./components/Signature";
library.add(fas);

interface ItemProps {
  style?: React.CSSProperties;
  index?: number;
}
const Item: React.FC<ItemProps> = ({ style, index }) => {
  return (
    <div
      className="item"
      style={{
        ...style,
        backgroundColor: index! % 2 === 0 ? "burlywood" : "cadetblue",
      }}
    >
      {index}
    </div>
  );
};
const list = new Array(10000).fill(0).map((item, i) => i);

// const LazyGui = React.lazy(() => import("./Guang"));
function App() {
  const renderOption = (item: DataSourceType) => {
    return (
      <>
        <div>{item.value}</div>
        <div>{item.label}</div>
      </>
    );
  };
  const handleFetch = (str: string) => {
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
      .then((res) => res.json())
      .then((res) => {
        return res.items
          .map((item: { login: any; id: string }) => ({
            value: item.login,
            label: item.id,
          }))
          .slice(0, 10);
      });
  };
  return (
    <div className="App">
      <Icon icon="arrow-down" theme="danger" size="lg"></Icon>
      <header className="App-header">
        <Button btnType="primary">Heello</Button>
        <Menu
          defaultIndex="0"
          onSelect={(e, index) => console.log(e, index)}
          mode="vertical"
        >
          <MenuItem>link1</MenuItem>
          <Menu.Item>link2</Menu.Item>
          <Menu.SubMenu title="子菜单">
            <Menu.Item>link3</Menu.Item>
            <SubMenu title="子菜单2">
              <Menu.Item>link4</Menu.Item>
            </SubMenu>
            <MenuItem>link5</MenuItem>
          </Menu.SubMenu>
        </Menu>
        <Input defaultValue={["asd", "sadsd"]}></Input>
        <AutoComplete
          fetchSuggestions={handleFetch}
          renderOption={renderOption}
          // onEnterDown={(item)=>console.log(1,item)}
          onChange={() => console.log(1)}
          style={{ width: "200px" }}
        ></AutoComplete>
        <Upload
          action={
            "https://run.mocky.io/v3/9b60839d-d5ee-40b2-9149-bc006b7d5f15"
          }
          onprogress={() => console.log(1)}
          onSuccess={() => console.log(2)}
          onError={(err) => console.log(err)}
          multiple
          maxsize={5}
          maxnum={1}
          styleUploadList={{ width: "300px" }}
        >
          <Icon theme="primary" icon="upload" size="4x"></Icon>
        </Upload>
      </header>
      {/* 列表项高度固定 - 虚拟列表实现 */}
      {/* <VirtualList
        containerHeight={300}
        itemCount={list.length}
        itemHeight={50}
      >
        <Item />
      </VirtualList> */}
      <Signature onSave={(e) => console.log(e)}></Signature>
      {/* <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p>
      <p>xxxxxx</p> */}
      {/* <LazyLoad
        placeholder={<div>loading...</div>}
        onContentVisible={() => {
          console.log("comp visible");
        }}
      >
      
        <Guang></Guang>
      </LazyLoad> */}
      {/* <LazyLoad
        placeholder={<div>loading...</div>}
        offset={300}
        onContentVisible={() => {
          console.log("img visible");
        }}
      >
        <img src={img2} />
      </LazyLoad> */}
    </div>
  );
}

export default App;
