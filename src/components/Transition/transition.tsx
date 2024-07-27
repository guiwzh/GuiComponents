import React, { ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'

type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right'

type TransitionProps = CSSTransitionProps & {
  animation?: AnimationName,
  wrapper?: boolean,//通过wrapper添加一层div标签，解决重复设置transform，导致动画效果消失的问题
  children?: ReactNode
}

const Transition: React.FC<TransitionProps> = (props) => {
  const {
    children,
    classNames,
    animation,
    wrapper,
    unmountOnExit=true,//该属性可以根据in属性的true和false实现子节点的挂载与卸载，从而无需自行添加display:none与block的转换
    appear=true,
    ...restProps
  } = props
  return (
    <CSSTransition
      classNames = { classNames ? classNames : animation}
      unmountOnExit={unmountOnExit}
      appear={appear}
      {...restProps}
    >
      {wrapper ? <div>{children}</div> : children}
    </CSSTransition>
  )
}

export default Transition