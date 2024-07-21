import React, { useState,createContext,Children } from "react";
import classNames from "classnames";
import { MenuItemProps } from "./menuItem";


type Menumode = "horizontal" | "vertical";
type SelectCallback=(Index: string,e:React.MouseEvent) => void;
export interface MenuProps {
    defaultIndex?: string; /**默认 active 的菜单项的索引值 */
    className?: string;
    mode?: Menumode;
    style?: React.CSSProperties;
    onSelect?:SelectCallback;
    children?: React.ReactNode;
    defaultOpenSubMenus?: string[]; /**设置子菜单的默认打开 只在纵向模式下生效 */
}

interface ImenuContext {
    index: string;
    onSelect?:SelectCallback;
    mode?: Menumode;
    defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<ImenuContext>({ index: "0" });
export const Menu: React.FC<MenuProps> = (props) => {
    const { className, mode="horizontal" ,style, children,defaultIndex="0",onSelect,defaultOpenSubMenus=[] } = props;
    const [currentActive, setActive]=useState(defaultIndex);

    const handleClick = (index: string,e:React.MouseEvent,) =>{
        setActive(index)
        if(onSelect){
            onSelect(index,e)
        }
    }
    const passedContext: ImenuContext = {   
        index: currentActive, 
        onSelect: handleClick,
        mode,
        defaultOpenSubMenus
    };//通过useContext将当前菜单的index、onSelect、mode、defaultOpenSubMenus传递给子组件
    const renderChildren = () => {
        return Children.map(children, (child,index) => { 
            const childElement = child as React.FunctionComponentElement<MenuItemProps>;//类型断言成FC，以此能够获取子组件的type属性，然后获取到displayName，从而能判断包裹的子组件是否是MenuItem或SubMenu，如果不是则报错。
            const {displayName}=childElement.type
            if(displayName === "MenuItem" || displayName === "SubMenu"){
                return React.cloneElement(childElement, {
                    index: index.toString()
                })//通过将该map函数中的index添加到子组件中，以此来判断自己是第几个导航元素
            }else{
                console.error("Warning: Menu has a child which is not a MenuItem component")
            }
            
        });
    }
    const classes = classNames("viking-menu", className, {
        "menu-vertical": mode === "vertical",
        "menu-horizontal": mode !== "vertical",
    });
    return (
        <ul className={classes} style={style}>
            <MenuContext.Provider value={passedContext}>
            {renderChildren()}
            </MenuContext.Provider>
        </ul>
    );
}

export default Menu;