import React,{ FC, useContext, useState, FunctionComponentElement, ReactNode } from 'react'
import classNames from 'classnames'
import { MenuContext } from './menu'
import { MenuItemProps } from './menuItem'
// import Icon from '../Icon/icon'
// import Transition from '../Transition/transition'
export interface SubMenuProps {
  index?: string;
  /**下拉菜单选项的文字 */
  title: string;
  /**下拉菜单选型的扩展类名 */
  className?: string;
  children?: ReactNode;
}

export const SubMenu: FC<SubMenuProps> = ({ index, title, children, className}) => {
  const context = useContext(MenuContext)
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>

  const isOpend = (index && context.mode === 'vertical') ? openedSubMenus.includes(index) : false
  const [ menuOpen, setOpen ] = useState(isOpend) //控制下下拉菜单的展开
  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
    'is-opened': menuOpen,
    'is-vertical': context.mode === 'vertical'
  })
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(!menuOpen)
  }
  let timer: any
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
      setOpen(toggle)
    }, 300)//设置一个300ms的Monse移入移出的延时执行（防抖）
  }
  const clickEvents = context.mode === 'vertical' ? {
    onClick: handleClick
  } : {}//仅有水平模式才支持点击展开
  const hoverEvents = context.mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true)},
    onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false)}
  } : {}//仅有水平模式才支持鼠标移入移出展开
  const renderChildren = () => {
    const subMenuClasses = classNames('viking-submenu', {
      'menu-opened': menuOpen
    })
    console.log(children)
    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>
      if (childElement.type.displayName === 'MenuItem' || childElement.type.displayName === 'SubMenu') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`
        })
      } else {
        console.error("Warning: SubMenu has a child which is not a MenuItem component")
      }
    })
    return (

      <ul className={subMenuClasses}>
      {childrenComponent}
      </ul>
      // <Transition
      //   in={menuOpen}
      //   timeout={300}
      //   animation="zoom-in-top"
      // >
      
      // </Transition>
    )
  }
  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="submenu-title" {...clickEvents}>
        {title}
        {/* <Icon icon="angle-down" className="arrow-icon"/> */}
      </div>
      {renderChildren()}
    </li>
  )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu;